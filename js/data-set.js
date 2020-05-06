import News from "./news.js";

export default class DataSet {

    constructor(url) {

        this._url = ['./data/stats.json','./data/oblast.json','./data/prediction.json','./data/test.json'];

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

                        _this._dataRequest(_this._url[3], function (test) {
                    
                            _this.data = [stats, oblast, predict, test];
                    
                        collect(_this.data, callback);

                        })
                        
                    });

                });
                
            });

        
        
        
        function collect(data, callback) {
            
            
            const news = new News().data;
            const stats = data[0];
            const markers = data[1];
            const predict = data[2];
            const test = data[3];
            
            const byDates = {};
            const result = [];
            
            statsToObj('city','moscow', byDates);
            statsToObj('oblast','oblast', byDates);


            
            let testCount = 0
            let maxTest = 0;

            for (var i in test) {
                if (+i > +maxTest) maxTest = +i;

                let next = null;
                let date = +i;
                
                Object.entries(test).forEach(function(e){

                    if (!next && +e[0] > date) {
                        next = +e[0];
                    }    

                });

                test[i].nextStep = next;
                test[i].allTotal = test[i].moscowTotal + test[i].oblastTotal;

            }    

            for (var i in test) {

                let date = +i;
                let next = test[i].nextStep;
                let offset = test[i].nextStep - date;
            
                if (date < maxTest){

                    

                for (var s = 0; s < 100; s++) {

                    if (!test[date + s] && date + s < maxTest ) {

                        

                        let prev = (s > 0) ? s-1 : s;

                        test[date + s] = {

                            allNew : +((test[next].allTotal  - test[date].allTotal)  / offset).toFixed(),

                            moscowTotal : test[date + prev].moscowTotal + +((test[next].moscowTotal - test[date].moscowTotal) / offset).toFixed(),
                            oblastTotal : test[date + prev].oblastTotal + +((test[next].oblastTotal - test[date].oblastTotal) / offset).toFixed(),
                            allTotal  : test[date + prev].allTotal  + +((test[next].allTotal  - test[date].allTotal)  / offset).toFixed()

                        };                            

                    }

                }

                }

                testCount++

            }

        

            
            let lastTestDate = null;

            for (var i in byDates) {
                
                if ( test[i] ) {

                byDates[i].tests = test[i];

                lastTestDate = i;


                } else {

                    if (lastTestDate) {
                        
                        byDates[i].tests = test[lastTestDate];
                        byDates[i].tests.lastStep = lastTestDate;

                        

                    }

                }


                

                if (!byDates[i].oblast) {
                    
                    byDates[i].oblast = {
                        new: {
                            cases: 0, 
                            deaths: 0, 
                            recovered: 0
                        },
                        total: {
                            cases: 0, 
                            deaths: 0, 
                            recovered: 0
                        }
                    }
                
                }
                
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
                        
                    }
                    
                }
                
                byDates[i].points = {
                    new : [],
                    total : []
                };
                
                if (news[i]) {
                    
                    byDates[i].news = {
                        text : news[i][0],
                        url : news[i][1]
                    }
                    
                }
                
            }
            
            
            
            
            
   
            let lastkey = null;
            let lastMarkers = null
            
            for (var i in byDates) {
                
                
                
                if (markers[i]) {
                    
                    lastMarkers = markers[i];  
                    
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
                
                lastkey = i;
                
                result.push( byDates[i] );
                 
            }
            
            
            
            
            function statsToObj(datakey, resultkey, resultobj){
            
                for (var i = 0; i < stats[datakey].length; i++) {

                    if ( !resultobj[ stats[datakey][i].date ] ) {
                        
                        let dataArr = [
                            (stats[datakey][i].date + '').substr(0, 4) + '',
                            (stats[datakey][i].date + '').substr(4,2) + '',
                            (stats[datakey][i].date + '').substr(6,2) + ''
                        ];
                        
                        let month = {
                            1  : 'января',
                            2  : 'февраля',
                            3  : 'марта',
                            4  : 'апреля',
                            5  : 'мая',
                            6  : 'июня',
                            7  : 'июля',
                            8  : 'августа',
                            9  : 'сентября',
                            10 : 'октября',
                            11 : 'ноября',
                            12 : 'декабря'
                        }
                        
                        resultobj[ stats[datakey][i].date ] = {

                            dateIndex: stats[datakey][i].date,
                            dateArr: dataArr
                        };

                        resultobj[ stats[datakey][i].date ].date = `${+dataArr[2]} ${month[ new Number (dataArr[1]) ]}`;

                    }

                    resultobj[ stats[datakey][i].date ][resultkey] = {
                        new : stats[datakey][i].new,
                        total : stats[datakey][i].total
                    }


                }
                
            }
            

            const resultPredict = [];

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

            
            
            if (callback) callback(result, resultPredict);
            
        }
        

        

        return this;

    }

}