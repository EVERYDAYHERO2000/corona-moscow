import pandas as pd
import numpy as np
from scipy.optimize import curve_fit
from datetime import datetime, timedelta
import json

pd.set_option('display.max_columns', None)

def new_columns(df):
  return list(df.columns.map(lambda x: '20{2:d}{1:02d}{0:02d}'.format(int(x.split(sep='/')[1]), int(x.split(sep='/')[0]), int(x.split(sep='/')[2]))))

moscow = pd.read_csv('https://raw.githubusercontent.com/EVERYDAYHERO2000/corona-moscow/gh-pages/data/stats.csv').iloc[:, 4:]
moscow.columns = new_columns(moscow)
moscow.index = ['cases', 'deaths', 'recovered']

add_days = 14

strToDate = lambda dateStr: datetime.strptime(dateStr, "%Y%m%d")
diff = lambda src: src.copy().diff(axis=1).fillna(0)

def smooth(src, n):
    res = src.copy()
    
    for i in range(n):
        center = res.copy()
        left = (res.copy().shift(periods=1, axis='columns', fill_value=0) + center) / 2
        right = res.copy().shift(periods=-1, axis='columns')
        right.iloc[:, -1] = res.iloc[:, -1]
        right = (right + center) / 2
        res = (left + right) / 2
    res = res.round(1)
    return res

def logistic(x, a, b, c):
    return c / (1 + np.exp(-(x - b) / a))

def logisticDerivative(x, a, b, c):
    return (c * np.exp(-(x - b) / a)) / ( a * (1 + np.exp(-(x - b) / a)) ** 2)

def getCurveParams(df, fn, total_min=20, total_max=2000000, params=[1, 1, 1, 0, 0, 0]):
    y = df.values.tolist()
    x = list(range(1, len(y) + 1))
    
    min_slope = min(99, params[0])
    min_peak = params[1]
    min_total = max(total_min, params[2])
    max_total = total_max
    
    p0 = min_slope, min_peak, min_total
    bounds=(
        [min_slope, min_peak, min_total],
        [100, min_peak + 200, max_total]
    )

    fit = curve_fit(fn, x, y, p0=p0, bounds=bounds, max_nfev=99999)
    slope, peak, y_max = fit[0]
    
    slope_error, peak_error, y_max_error = [
        np.sqrt(fit[1][i][i]) for i in [0, 1, 2]
    ]

    return [slope, peak, y_max, slope_error, peak_error, y_max_error]

def getPrediction(days, curve_params, fn, countError = True):
    slope, peak, y_max, slope_error, peak_error, y_max_error = curve_params

    return pd.DataFrame([list(int(fn(
            x + 1, slope + slope_error * countError, peak + peak_error * countError, y_max + y_max_error * countError)) for x in range(days + add_days)
        )])

def getMinParams(params, y_min):
    slope, peak, y_max, slope_error, peak_error, y_max_error = params
    
    if (slope_error == float("inf") or slope_error > slope or
        peak_error == float("inf") or peak_error > peak or
        y_max_error == float("inf")) or y_max_error > y_max:
        return [slope, peak, y_min, 0, 0, 0]
    return params

def predict(df):
    cumulative = df.copy().fillna(0)
    daily = diff(cumulative)
    
    last_label = cumulative.columns[-1]
    last_date = strToDate(last_label)
    
    days = len(cumulative.columns)
    cases = cumulative.loc['cases']
    recovered = cumulative.loc['recovered']
    deaths = cumulative.loc['deaths']
    
    cases_last = cases[-1]
    cases_daily_last = daily.loc['cases'][-1]
    recovered_last = recovered[-1]
    deaths_last = deaths[-1]
    fatality = (recovered_last or deaths_last) and deaths_last / (recovered_last + deaths_last)
    
    n = 10
    dailysm = smooth(daily, n)
    
    min_total = cases_last + cases_daily_last + 1
        
    derivsm_params = getCurveParams(dailysm.loc['cases'], logisticDerivative, min_total)
    derivsm_params_bounded = getCurveParams(cases, logistic, min_total, params=derivsm_params)
    
    params = derivsm_params_bounded if derivsm_params_bounded[5]/derivsm_params_bounded[2] < 0.3 else derivsm_params
    params = getMinParams(params, min_total)
    
    predicted_cases = getPrediction(days, params, logistic)
    
    predicted_cases_max = params[2] + params[5]
    
    min_deaths = max(int(predicted_cases_max * (fatality - 0.02)), deaths[-1])
    max_deaths = max(int(predicted_cases_max * (fatality + 0.02)), deaths[-1] + 1)
    deaths_params = getCurveParams(deaths, logistic, min_deaths, max_deaths, [1, 0, 0, 0, 0, 0, 0])
    deaths_params = getMinParams(deaths_params, min_deaths)

    predicted_deaths = getPrediction(days, deaths_params, logistic, False)
    
    predicted_deaths_max = deaths_params[2]
    
    min_recovered = predicted_cases_max - predicted_deaths_max
    recovered_params = getCurveParams(recovered, logistic, min_recovered - 1, min_recovered, [max(params[0] + params[3], deaths_params[0]) + 0.1, max(params[1] + params[4], deaths_params[1]), 0, 0, 0, 0])
    recovered_params = getMinParams(recovered_params, min_recovered)
    recovered_params[2] = min_recovered
    
    predicted_recovered = getPrediction(days, recovered_params, logistic, False)
    
    prediction = predicted_cases.append(predicted_recovered).append(predicted_deaths)
    prediction.index = ['cases', 'recovered', 'deaths']
    
    dates_generated = [(last_date + timedelta(days = x + 1)).strftime("%Y%m%d") for x in range(add_days)]
    prediction.columns = list(cumulative.columns) + dates_generated
    return prediction

days_total = len(moscow.columns)

predict(moscow).to_json(path_or_buf ='./data/prediction.json', orient='columns')
past_predictions = {}

for n in range(days_total):
    day = moscow.columns[len(moscow.columns)-n-1]
    df = moscow.iloc[:, :days_total-n]
    last_label = df.columns[-1]
    pred = predict(df).loc[:, last_label:]
    pred_dict = json.loads(pred.to_json(orient='columns'))
    past_predictions[day] = {key:list(value.values()) for (key,value) in pred_dict.items()}
        
    add_days += 1
    
with open('./data/past-predictions.json', 'w') as fp:
    json.dump(past_predictions, fp)
print("done")
