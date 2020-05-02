export default class Chart {

    constructor() {

        this._data = null;
        
        
        return this;
    }  
    
    setMap(map) {
        
        this._map = map;
        
        return this;
    }
    
    setContent(content) {
        
        this._content = content;
        
        return this;
        
    }
    
    setStep(step) {
        
        const points = document.querySelectorAll('.ct-cases .ct-point');

        for (var p of points) {

            p.classList.remove('ct-point_active');

            if ( p.getAttribute('data-step') == step ) p.classList.add('ct-point_active');

        }
        
        return this;
    }
    
    setData(data, predict, type) {
        
        
        const _this = this;
        
        this._type = type;
        this._predict = predict;
        this._data = data;
        this._predictLength = (this._type == 'all') ? 14 : 0;
        
        
        const labels = (function (data, predict) {
         
            let arr = [];
            
            for (var i = 0; i < data.length + _this._predictLength; i++ ) {
                
                arr.push( predict[i].date );
            }
            
            return arr;
              
        })(this._data, this._predict);        
        
        const series = (function (data, predict) {

            const allCases = [];
            const newCases = [];
            const newDeaths = [];
            const allDeaths = [];
            const newRecovered = [];
            const allRecovered = [];
            const activeCases = [];
            const mashCases = [];
            const predictCases = [];
            const predictRecovered = [];
            const predictDeaths = [];
            const predictActive = [];
            

            
            function interpolation (arr, steps) {

                let tempArr = [];

                steps--

                for (var i = 0; i < arr.length; i++) {

                    let leftP = (arr[i - 1]) ? arr[i - 1] : arr[i];
                    let rightP = (arr[i + 1]) ? arr[i + 1] : arr[i];
                    let currentP = arr[i];

                    let left = (leftP + currentP) / 2;
                    let right = (rightP + currentP) / 2;
                    let current = (left + right) / 2;

                    tempArr.push(current);

                }

                if (steps) tempArr = interpolation(tempArr, steps);

                return tempArr;

            }

            
            for (var i = 0; i < data.length; i++ ) {
                activeCases.push( data[i].moscowAndOblast.total.cases - data[i].moscowAndOblast.total.deaths - data[i].moscowAndOblast.total.recovered );
                allCases.push( data[i].moscowAndOblast.total.cases );
                newCases.push( data[i].moscowAndOblast.new.cases);
                newDeaths.push( data[i].moscowAndOblast.new.deaths );
                allDeaths.push( data[i].moscowAndOblast.total.deaths );
                newRecovered.push( data[i].moscowAndOblast.new.recovered );
                allRecovered.push( data[i].moscowAndOblast.total.recovered );
            }
            
            const newCasesInterpolated = interpolation(newCases, 10);
            const newRecoveredInterpolated = interpolation(newRecovered, 10);   
            
            for (var i = 0; i < data.length; i++ ) {
                
                const length = (data[i].points.new.length) ? data[i].points.total.length : null;
                
                mashCases.push( length ); 
            }
            
            
            let offsetCase = (allCases[allCases.length - 1] > predict[allCases.length - 1].value.cases ) ? 
                (allCases[allCases.length - 1] - predict[allCases.length - 1].value.cases) : 
                -(predict[allCases.length - 1].value.cases - allCases[allCases.length - 1]);
            
            let offsetRecovered = (allRecovered[allRecovered.length - 1] > predict[allRecovered.length - 1].value.recovered ) ? 
                (allRecovered[allCases.length - 1] - predict[allCases.length - 1].value.recovered) : 
                -(predict[allCases.length - 1].value.recovered - allRecovered[allRecovered.length - 1]);
            
            let offsetDeath = (allDeaths[allDeaths.length - 1] > predict[allDeaths.length - 1].value.deaths ) ? 
                (allDeaths[allDeaths.length - 1] - predict[allDeaths.length - 1].value.deaths) : 
                -(predict[allDeaths.length - 1].value.deaths - allDeaths[allDeaths.length - 1]); 
            
            let offsetActive = offsetDeath + offsetRecovered;
            
            
            for (var i = 0; i < predict.length; i++) {
                
                
                
                if (i >= allCases.length - 1 ) {
                    
                    if (i < allCases.length + _this._predictLength){
                    
                        predictCases.push(predict[i].value.cases + offsetCase);
                        predictDeaths.push(predict[i].value.deaths + offsetDeath);
                        predictRecovered.push(predict[i].value.recovered + offsetRecovered);
                        predictActive.push( (predict[i].value.cases + offsetCase) - (predict[i].value.recovered + offsetRecovered) - (predict[i].value.deaths + offsetDeath) );
                        
                    }
                    
                } else {
                    
                    predictCases.push(null);
                    predictDeaths.push(null);
                    predictRecovered.push(null);
                    predictActive.push(null);
                    
                }
                
            }
            
            let result = null;

            if (_this._type == 'all') {

                result = [
                    {
                        name : 'deaths',
                        data : allDeaths
                    }, {
                        name : 'recovered',
                        data : allRecovered 
                    }, {
                        name : 'cases',
                        data : allCases
                    }, {
                        name : 'active',
                        data : activeCases
                    }, {
                        name : 'predictCases',
                        data : predictCases
                    }, {
                        name : 'predictRedcovered',
                        data : predictRecovered
                    }, {
                        name : 'predictActive',
                        data : predictActive
                    }, {
                        name : 'predictDeaths',
                        data : predictDeaths
                    }
                ];

            }

            if (_this._type == 'new') {

                result = [
                    {
                        name : 'deaths',
                        data : newDeaths
                    }, {
                        name : 'recovered',
                        data : newRecovered
                    }, {
                        name : 'newCasesInterpolated',
                        data : newCasesInterpolated
                    }, {
                        name : 'newRecoveredInterpolated',
                        data : newRecoveredInterpolated    
                    }, {
                        name : 'cases',
                        data : newCases
                    }
                ];

            }

            return result;
              
        })(this._data, this._predict);

        
        this._chart = new Chartist.Line('#chart', {
            labels: labels,
            series: series
        }, {
            fullWidth: true,
            series: {
                'deaths': {
                    lineSmooth: Chartist.Interpolation.none(),
                    showPoint: false
                },
                'recovered': {
                    lineSmooth: Chartist.Interpolation.none(),
                    showPoint: false
                },
                'cases': {
                    lineSmooth: Chartist.Interpolation.none()
                }
            },
            plugins: [
                Chartist.plugins.ctPointLabels({
                  textAnchor: 'middle',
                  labelInterpolationFnc: function(data) {
                      
                      if (data.series.name == 'predictCases') return '';//`прогноз ${Math.floor(data.value.y/100)*100}`;
                      
                      let currentValue = data.value.y;
                      let prevValue = (data.series.data[data.index - 1]) ? data.series.data[data.index - 1] : 0;
                      let differenceValue = currentValue - prevValue;  

                      return (_this._type == 'all') ? (differenceValue) ? `+${differenceValue}` : '' : (currentValue) ? `+${currentValue}` : '';
                  }
                })
              ],
            chartPadding: {
                right: 40
            },
            low: 0
        });
        

        
        this._chart.on('created', function(e,i) {

            const lines = document.querySelectorAll('.ct-series');

            for (var l of lines) {

                let name = l.getAttribute('ct:series-name')

                l.classList.add('ct-' + name);

            }
                
            const points = document.querySelectorAll('.ct-cases .ct-point');
            const dateLabels = document.querySelectorAll('.ct-label.ct-horizontal');
            
            dateLabels[0].classList.add('visible');    
            dateLabels[_this._data.length - 1].classList.add('visible');
            dateLabels[dateLabels.length - 1].classList.add('visible');
        
            let count = 0;
        
            for (var p of points) {
                
                p.setAttribute('data-step', count);
                
                count++
            
                p.addEventListener('click', function () {
                    
                    const step = new Number (this.getAttribute('data-step')) + 0;
                    
                    _this.setStep(step);
                    
                    _this._map._playButton.setAttribute('data-state', 'pause');
                    
                    clearInterval(_this._map._animationTimer);
                    
                    _this._content.drawData(step);
                    
                    _this._map.drawData(step);
                    
                    
                    
                });
            
            }
            
            _this.setStep(_this._data.length - 1);

        });

        if (!_this._controls){

        let controls = document.querySelectorAll('#chart-controls .leaflet-control');

        _this._controls = controls;
        
        for (var c of controls) {

            c.addEventListener('click', function (e) {

                let type = e.target.getAttribute('data-type');

                if (type) {

                    _this.setData(_this._data, _this._predict, type );

                    let controls = document.querySelectorAll('#chart-controls .leaflet-control')

                    for (var el of controls) {

                        if (type == el.getAttribute('data-type')) el.classList.add('leaflet-disabled');
                        if (type != el.getAttribute('data-type')) el.classList.remove('leaflet-disabled');

                    }

                }

            });    
        
        }

        }
        
        return this;
        
    }
    
}