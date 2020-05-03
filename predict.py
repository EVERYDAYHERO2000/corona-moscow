import pandas as pd
import numpy as np
from scipy.optimize import curve_fit
from datetime import datetime, timedelta

pd.set_option('display.max_columns', None)

def new_columns(df):
  return list(df.columns.map(lambda x: '20{2:d}{1:02d}{0:02d}'.format(int(x.split(sep='/')[1]), int(x.split(sep='/')[0]), int(x.split(sep='/')[2]))))

moscow = pd.read_csv('https://raw.githubusercontent.com/EVERYDAYHERO2000/corona-moscow/gh-pages/data/stats.csv').iloc[:, 4:]
moscow.columns = new_columns(moscow)
moscow.index = ['cases', 'deaths', 'recovered']

add_days = 30

strToDate = lambda dateStr: datetime.strptime(dateStr, "%Y%m%d")
diff = lambda src: src.copy().diff(axis=1).fillna(0)

def smooth(src, count):
    res = src.copy()
    for n in range(count):
        res = res.rolling(window=(max(2*n, 2)), min_periods=1, center=True, axis=1).mean()
    res = res.round(1)
    return res

def logistic(x, a, b, c):
    return c / (1 + np.exp(-(x - b) / a))

def logisticDerivative(x, a, b, c):
    return (c * np.exp(-(x - b) / a)) / ( a * (1 + np.exp(-(x - b) / a)) ** 2)

def getCurveParams(df, fn, total_min=0, total_max=0, params=[0, 0, 0, 0, 0, 0]):
    y = df.values.tolist()
    x = list(range(1, len(y) + 1))
    
    min_slope = params[0]
    min_peak = params[1]
    min_total = max(total_min, params[2])
    max_total = total_max or min_total + 2000000
    
    p0 = min_slope + 3, min_peak + 7, (min_total + max_total)/2
    bounds=(
        [min_slope, min_peak, min_total],
        [min_slope + 20, min_peak + 200, max_total]
    )

    fit = curve_fit(fn, x, y, p0=p0, bounds=bounds, max_nfev=99999)
    slope, peak, y_max = fit[0]
    
    slope_error, peak_error, y_max_error = [
        np.sqrt(fit[1][i][i]) for i in [0, 1, 2]
    ]

    return slope, peak, int(y_max), slope_error, peak_error, int(y_max_error)

def getPrediction(days, curve_params, fn, countError = False):
    slope, peak, y_max, slope_error, peak_error, y_max_error = curve_params

    return pd.DataFrame([list(int(fn(
            x + 1, slope + slope_error * countError, peak + peak_error * countError, y_max + y_max_error * countError)) for x in range(days + add_days)
        )])

cumulative = moscow.copy().fillna(0)
daily = diff(cumulative)
    
start_label = daily.loc['cases', :].gt(1, axis=0).idxmax(axis=1)

first_date = strToDate(cumulative.columns[0])
last_date = strToDate(cumulative.columns[-1])

days = len(cumulative.columns)
cases = cumulative.loc['cases']
recovered = cumulative.loc['recovered']
deaths = cumulative.loc['deaths']

cases_last = cases[-1]
cases_daily_last = daily.loc['cases'][-1]
recovered_last = recovered[-1]
deaths_last = deaths[-1]
fatality = deaths_last / (recovered_last + deaths_last)

min_total = cases_last + cases_daily_last

cases_params = getCurveParams(cases, logistic)
deriv_params = getCurveParams(daily.loc['cases'], logisticDerivative)

params = deriv_params if deriv_params[5] < deriv_params[2] * 0.25 else cases_params

cases_params_bounded = getCurveParams(cases, logistic, min_total, params=params)
predicted_cases_max = cases_params_bounded[2] + cases_params_bounded[5]

predicted_cases = getPrediction(days, cases_params_bounded, logistic, True)
predicted_daily_cases = getPrediction(days, cases_params_bounded, logisticDerivative, True)

n = 2
    
while (n < 10 and abs(cases_daily_last - int(predicted_daily_cases[days])) > cases_daily_last * 0.25):
    deriv_params = getCurveParams((smooth(daily, n)).loc['cases'], logisticDerivative)
    n += 1
    params = deriv_params if deriv_params[5] < deriv_params[2] * 0.25 else cases_params
    cases_params_bounded = getCurveParams(cases, logistic, min_total, params=params)
    predicted_cases_max = cases_params_bounded[2] + cases_params_bounded[5]
    predicted_cases = getPrediction(days, cases_params_bounded, logistic, True)
    predicted_daily_cases = getPrediction(days, cases_params_bounded, logisticDerivative, True)

min_deaths, max_deaths = int(predicted_cases_max * (fatality - 0.02)), int(predicted_cases_max * (fatality + 0.02))
deaths_params = getCurveParams(deaths, logistic, min_deaths, max_deaths)
predicted_deaths_max = deaths_params[2]

predicted_deaths = getPrediction(days, deaths_params, logistic)

min_recovered = predicted_cases_max - predicted_deaths_max
recovered_params = getCurveParams(recovered, logistic, min_recovered - 1, min_recovered)

predicted_recovered = getPrediction(days, recovered_params, logistic)

prediction = predicted_cases.append(predicted_recovered).append(predicted_deaths)
prediction.index = ['cases', 'recovered', 'deaths']

dates_generated = [(last_date + timedelta(days = x + 1)).strftime("%Y%m%d") for x in range(add_days)]
prediction.columns = list(cumulative.columns) + dates_generated

prediction.to_json(path_or_buf ='./data/prediction.json', orient='columns')
print("done")
