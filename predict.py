import pandas as pd
import numpy as np
from scipy.optimize import curve_fit
from datetime import datetime, timedelta

pd.set_option('display.max_columns', None)

def new_columns(df):
  return list(df.columns[:4]) + list(df.columns[4:].map(lambda x: '20{2:d}{1:02d}{0:02d}'.format(int(x.split(sep='/')[1]), int(x.split(sep='/')[0]), int(x.split(sep='/')[2]))))

moscow = pd.read_csv('https://raw.githubusercontent.com/EVERYDAYHERO2000/corona-moscow/master/data/stats.csv')
moscow.columns = new_columns(moscow)

cases = moscow.iloc[0:1, 4:]
deaths = moscow.iloc[1:2, 4:]
recovered = moscow.iloc[2:3, 4:]

add_days = 30

diff = lambda src: src.copy().diff(axis=1).fillna(0)

def smooth(src, count):
    res = src.copy()
    for n in range(count):
        res = res.rolling(window=(max(2*n, 2)), min_periods=1, center=True, axis=1).mean()
    res = res.round(1)
    return res

def logistic(x, a, b, c):
    return c / (1 + np.exp(-(x - b) / a))

def getCurveParams(df, midpoint_min, max_value):
    y_cases = df.sum().values.tolist()
    x_days = list(range(1, len(y_cases) + 1))
    p0 = 3, midpoint_min + 7, max_value + 50000 # speed, peak, amplitude
    bounds=([0, midpoint_min, max_value], [20, 200, max_value + 2000000])

    fit = curve_fit(logistic, x_days, y_cases, p0=p0, bounds=bounds, max_nfev=1000)

    speed, x_peak, y_max = fit[0]
    speed_error, x_peak_error, y_max_error = [np.sqrt(fit[1][i][i]) for i in [0, 1, 2]]

    return x_days, y_cases, speed, x_peak, y_max, speed_error, x_peak_error, y_max_error

strToDate = lambda dateStr: datetime.strptime(dateStr, "%Y%m%d")

def predict(df, max_value):
    d0 = df.copy().fillna(0)
    
    d1 = diff(d0)
    
    d2 = diff(d1)
    d2sm = smooth(d2, 4)
    
    d3 = diff(d2)
    d3sm = smooth(d3, 5)
    
    d3_min = d3sm.sum().min(axis=0)
    d2_min = d2sm.sum().min(axis=0)
    
    d3_pos_id = d3sm.sum().gt(1, axis=0).idxmax(axis=1)
    d3_neg_id = d3sm.loc[:,d3_pos_id:].sum().lt(max(-5, d3_min / 3), axis=0).idxmax(axis=1)
    d2_neg_id = d2sm.loc[:,d3_neg_id:].sum().lt(max(-5, d2_min / 3), axis=0).idxmax(axis=1)
        
    last_date = strToDate(d0.columns[-1])
    first_date =  strToDate(d0.columns[0])
    midpoint_min = last_date + timedelta(days=1)

    if (d3_neg_id != d3_pos_id):
        if (d2_neg_id != d3_neg_id):
            midpoint_min = strToDate(d2_neg_id)
        else:
            midpoint_min = max(strToDate(d3_neg_id) + timedelta(days=8), midpoint_min + timedelta(days=1))
    else:
        midpoint_min = max(strToDate(d3_pos_id) + timedelta(days=17), midpoint_min)

    midpoint_min -= first_date

    x_days, y_cases, speed, x_peak, y_max, speed_error, x_peak_error, y_max_error = getCurveParams(d0, midpoint_min.days, max_value)

    prediction = pd.DataFrame([list(int(logistic(x + 1, speed, x_peak + int(x_peak_error), y_max + y_max_error)) for x in range(len(x_days) + add_days))]).round(0)

    date_generated = [(last_date + timedelta(days = x + 1)).strftime("%Y%m%d") for x in range(add_days)]
    prediction.columns = list(d0.columns) + date_generated
    
    error = df.loc[:, df.columns[-1]] - prediction.loc[:, df.columns[-1]].sum()
    if int(error) > 0: prediction += int(error)
    
    return prediction
    
max_cases = cases.iloc[-1,-1]
max_deaths = deaths.iloc[-1,-1]
fatality = max_deaths / (recovered.iloc[-1,-1] + max_deaths)

cases_prediction = predict(cases, max_cases)
recovered_prediction = predict(recovered, max_cases * (1 - fatality))
deaths_prediction = predict(deaths, max_cases * fatality)

prediction = cases_prediction.append(recovered_prediction).append(deaths_prediction)
prediction.index = ['cases', 'recovered', 'deaths']
prediction.to_json(path_or_buf ='./data/prediction.json', orient='columns')
