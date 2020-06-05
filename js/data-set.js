import News from "./news.js";

export default class DataSet {

    constructor(url) {

        this._url = ['./data/data.json','./data/oblast.json','./data/prediction.json'];

        const _this = this;

        
        this._dataRequest = function (url, callback) {

            if (window.fetch) {
                fetch(url)
                    .then(response => response.json())
                    .then(function (data) {

                        callback(data);

                    });

            } else {
                $.ajax({
                    type: 'GET',
                    url: url,
                    dataType: 'json',
                    success: function (data) {

                        callback(JSON.parse(data));

                    }
                });
            }

        }

        return this;

    }

    load(callback) {

        const _this = this;


        

            _this._dataRequest(_this._url[0], function (stats) {
                
                _this._dataRequest(_this._url[1], function (oblast) {
                    
                    _this._dataRequest(_this._url[2], function (predict) {

                        _this.data = [stats, oblast, predict];

                        
                    
                        collect(_this.data, callback);
                        
                    });

                });
                
            });

        
        
        
        function collect(data, callback) {
            
            
            const news = new News().data;
            const byDates = data[0];
            const markers = data[1];
            const predict = data[2];
            
           

            const result = [];
            const resultPredict = [];
            



            for (var i in byDates) {
                
                byDates[i].moscowAndOblast = {
                    
                    new: {
                        
                        cases: byDates[i].moscow.new.cases + byDates[i].oblast.new.cases,
                        deaths: byDates[i].moscow.new.deaths + byDates[i].oblast.new.deaths,
                        recovered: byDates[i].moscow.new.recovered + byDates[i].oblast.new.recovered,
                        
                    },
                    total: {
                        
                        cases: byDates[i].moscow.total.cases + byDates[i].oblast.total.cases,
                        deaths: byDates[i].moscow.total.deaths + byDates[i].oblast.total.deaths,
                        recovered: byDates[i].moscow.total.recovered + byDates[i].oblast.total.recovered,
                        active : byDates[i].moscow.total.active + byDates[i].oblast.total.active
                    }
    
                }
                
                if (news[i]) {
                    
                    byDates[i].news = {
                        text : news[i][0],
                        url : news[i][1]
                    }
                    
                }
                
            }
            
            
            
            let lastMarkers = null
            
            for (var i in byDates) {

                let date = byDates[i].dateIndex;
                
                if (markers[date]) {
                    
                    lastMarkers = markers[date];  
                    
                }                
                
                byDates[i].markers = (function(lastMarkers, moscow){
                    
                    let moscowMarker = {
                        name : 'Москва',
                        total : moscow.total.cases,
                        point : [55.755814, 37.617635]
                    };
                    
                    let markers = (lastMarkers) ? lastMarkers : [];
                    
                    let matchMoscow = false;
                    for (var m = 0; m < markers.length; m++) {
                        
                        
                        if (markers[m].name == 'Москва') {
                            matchMoscow = true;
                            break;
                        }
                        
                    }
                    
                    if (!matchMoscow) {
                        markers.push(moscowMarker);
                        
                    }
                    
                    return markers;
                    
                })(lastMarkers, byDates[i].moscow, i)
                
                result.push( byDates[i] );
                 
            }        

            let last = null
            
            for (var p in predict) {

                let dataArr = [
                    (p + '').substr(0, 4) + '',
                    (p + '').substr(4, 2) + '',
                    (p + '').substr(6, 2) + ''
                ];

                let month = {
                    1: 'января',
                    2: 'февраля',
                    3: 'марта',
                    4: 'апреля',
                    5: 'мая',
                    6: 'июня',
                    7: 'июля',
                    8: 'августа',
                    9: 'сентября',
                    10: 'октября',
                    11: 'ноября',
                    12: 'декабря'
                }

                predict[p].newCases = (last) ? predict[p].cases - last.cases : 0;
                predict[p].newRecovered = (last) ? predict[p].recovered - last.recovered : 0;
                predict[p].newDeaths = (last) ? predict[p].deaths - last.deaths : 0;

                last = predict[p];  

                resultPredict.push({
                    
                    dateIndex : +p,
                    dateArr: dataArr,
                    date: `${+dataArr[2]} ${month[ new Number (dataArr[1]) ]}`,
                    value: predict[p]

                })

            }

            //result = result.reverce();

            window.result = result        
            
            if (callback) callback(result, resultPredict);
            
        }
        
        return this;

    }

}