import News from "./news.js";

export default class DataSet {

    constructor(url) {

        this._url = ['./data/data.json', './data/stats.json'];

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


        this._dataRequest(this._url[0], function (data) {

            _this._dataRequest(_this._url[1], function (stats) {
                
                _this.data = [data,stats];
                
                collect([data,stats], callback);

                
                
            });

        });
        
        
        function collect(data, callback) {
            
            
            const news = new News().data;
            const points = data[0];
            const stats = data[1];
            
            const byDates = {};
            const result = [];
            
            statsToObj('city','moscow', byDates);
            statsToObj('oblast','oblast', byDates);
            
            for (var i in byDates) {
                
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
            
            for (var i = 0; i < points.length; i++){
                
                let point = [
                    points[i].point[0],
                    points[i].point[1],
                    points[i].address,
                    byDates[points[i].date].date
                ] 
                
                byDates[points[i].date].points.new.push( point );
                byDates[points[i].date].points.total.push( point );
                
            }
            
            let lastkey = null;
            
            for (var i in byDates) {
                
                if ( lastkey != null && byDates[lastkey] ) {
                    byDates[i].points.total = byDates[i].points.new.concat( byDates[lastkey].points.total );
                    
                }
                
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
            

            
            
            
            if (callback) callback(result);
            
        }
        

        return this;

    }

}