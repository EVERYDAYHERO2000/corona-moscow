import pandas as pd
import numpy as np
from scipy.optimize import curve_fit
from datetime import datetime, timedelta

import matplotlib.pyplot as plt

pd.set_option('display.max_columns', None)

def new_columns(df):
  return list(df.columns.map(lambda x: '{2:d}{1:02d}{0:02d}'.format(int(x.split(sep='/')[1]), int(x.split(sep='/')[0]), int(x.split(sep='/')[2]))))

moscow = pd.read_csv('https://raw.githubusercontent.com/EVERYDAYHERO2000/corona-moscow/gh-pages/data/stats.csv').iloc[:, 4:]
moscow.columns = new_columns(moscow)
moscow.index = ['cases', 'deaths', 'recovered']

add_days = 30

strToDate = lambda dateStr: datetime.strptime(dateStr, "%y%m%d")
diff = lambda src: src.copy().diff(axis=1).fillna(0)

def smooth(src, count):
    res = src.copy()
    for n in range(count):
        res = res.rolling(window=(max(2*n, 2)), min_periods=1, center=True, axis=1).mean()
    res = res.round(1)
    return res

def getData(df):
    d0 = df.copy().fillna(0)
    d0sm = smooth(d0, 5)

    d1 = diff(d0)
    d1sm = smooth(d1, 2)

    d2 = diff(d1)
    d2sm = smooth(d2, 4)

    d3 = diff(d2)
    d3sm = smooth(d3, 5)

    return [d0, d0sm, d1, d1sm, d2, d2sm, d3, d3sm]

def getPoints(data_all):
    d3_min = data_all[-1].min(axis=1)
    d2_min = data_all[-3].min(axis=1)

    last_date = strToDate(data_all[0].columns[-1])
    first_date = strToDate(data_all[0].columns[0])
    start = {}
    peak_min = {}

    for row in data_all[0].index:
        d3_pos_id = data_all[-1].loc[row, :].gt(1, axis=0).idxmax(axis=1)
        d3_neg_id = data_all[-1].loc[row, d3_pos_id:].lt(max(-5, d3_min.loc[row] / 3), axis=0).idxmax(axis=1)
        d2_neg_id = data_all[-3].loc[row, d3_neg_id:].lt(max(-5, d2_min.loc[row] / 3), axis=0).idxmax(axis=1)

        start[row] = d3_pos_id

        d3_pos = strToDate(d3_pos_id)
        d3_neg = strToDate(d3_neg_id)
        d2_neg = strToDate(d2_neg_id)
        
        if (d3_neg_id != d3_pos_id):
            if (d2_neg_id != d3_neg_id):
                peak_min[row] = d2_neg
            else:
                peak_min[row] = max(d3_neg + timedelta(days=4), last_date + timedelta(days=1))
        else:
            peak_min[row] = max(d3_pos + timedelta(days=12), last_date + timedelta(days=1))

        peak_min[row] -= first_date
    return start, peak_min

def logistic(x, a, b, c):
    return c / (1 + np.exp(-(x - b) / a))

def getCurveParams(df, peak_min, y_max_min, y_max_max):
    if (y_max_max < y_max_min) : print(y_max_min, y_max_max)
    y = df.values.tolist()
    x = list(range(1, len(y) + 1))
    p0 = 3, peak_min + 7, (y_max_min + y_max_max) / 2
    bounds=(
        [0, peak_min, y_max_min],
        [20, 200, y_max_max]
    )

    fit = curve_fit(logistic, x, y, p0=p0, bounds=bounds, max_nfev=1000)

    slope, peak, y_max = fit[0]
    slope_error, peak_error, y_max_error = [
        np.sqrt(fit[1][i][i]) for i in [0, 1, 2]
    ]

    return slope, peak, y_max, slope_error, peak_error, y_max_error

def getPrediction(days, curve_params):
    slope, peak, y_max, slope_error, peak_error, y_max_error = curve_params
    
    return pd.DataFrame([list(logistic(
            x + 1, slope, round(peak + peak_error, 0), y_max + y_max_error) for x in range(days + add_days)
        )]).round(0)

def plotPrediction(real_data, prediction, start, title):
    fig, ax = plt.subplots(figsize = [26,6])
    
    ax.plot(real_data.loc[start:].T, '-', alpha = 0.6, color = 'blue', label = 'real')
    ax.plot(prediction.loc[start:].T, '-', alpha = 0.6, color = 'orange', label = 'prediction')

    ax.legend(loc = 'upper left', prop=dict(size=12))
    ax.xaxis.grid(which='minor')
    ax.yaxis.grid()
    ax.tick_params(axis = 'x', labelrotation = 90)
    plt.title(title)
    plt.show()


data_all = getData(moscow)
start_dates, peaks = getPoints(data_all)

days = len(data_all[0].columns)
cases = data_all[0].loc['cases']
recovered = data_all[0].loc['recovered']
deaths = data_all[0].loc['deaths']

cases_last = cases[-1]
recovered_last = recovered[-1]
deaths_last = deaths[-1]
fatality = deaths_last / (recovered_last + deaths_last)

cases_params = getCurveParams(cases, peaks['cases'].days, cases_last + data_all[2].loc['cases'][-1], cases_last + 2000000)
recovered_params = getCurveParams(recovered, peaks['recovered'].days, int(cases_last * (1 - fatality)), int(cases_params[2] * (1 - fatality)) + 1)
deaths_params = getCurveParams(deaths, peaks['deaths'].days, int(cases_last * fatality), int(cases_params[2] - recovered_params[2]))

cases_prediction = getPrediction(days, cases_params)
recovered_prediction = getPrediction(days, recovered_params)
deaths_prediction = getPrediction(days, deaths_params)

prediction = cases_prediction.append(recovered_prediction).append(deaths_prediction)
prediction.index = ['cases', 'recovered', 'deaths']

last_date = strToDate(data_all[0].columns[-1])
dates_generated = [(last_date + timedelta(days = x + 1)).strftime("%y%m%d") for x in range(add_days)]
prediction.columns = list(data_all[0].columns) + dates_generated

prediction.to_json(path_or_buf ='./data/prediction.json', orient='columns')
print("done")
