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
        
        const points = document.querySelectorAll('.ct-series-c .ct-point');

        for (var p of points) {

            p.classList.remove('ct-point_active');

            if ( p.getAttribute('data-step') == step ) p.classList.add('ct-point_active');

        }
        
        return this;
    }
    
    setData(data, predict) {
        
        
        
        const _this = this;
        
        
        this._predict = predict;
        this._data = data;
        this._predictLength = 14;
        
        
        const labels = (function (data, predict) {
         
            let arr = [];
            
            for (var i = 0; i < data.length + _this._predictLength; i++ ) {
                
                arr.push( predict[i].date );
            }
            
            return arr;
              
        })(this._data, this._predict);
        
        
        const series = (function (data, predict) {

            
            const allCases = [];
            const newCases = []
            const allDeaths = [];
            const allRecovered = [];
            const activeCases = [];
            const mashCases = [];
            const predictCases = [];
            const predictRecovered = [];
            const predictDeaths = [];
            const predictActive = [];
            
            
            for (var i = 0; i < data.length; i++ ) {
                activeCases.push( data[i].moscowAndOblast.total.cases - data[i].moscowAndOblast.total.deaths - data[i].moscowAndOblast.total.recovered );
                allCases.push( data[i].moscowAndOblast.total.cases );
                newCases.push( data[i].moscowAndOblast.new.cases );
                allDeaths.push( data[i].moscowAndOblast.total.deaths );
                allRecovered.push( data[i].moscowAndOblast.total.recovered );
            }
            
            
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
                        predictRecovered.push(predict[i].value.recovered + offsetRecovered);
                        predictActive.push( (predict[i].value.cases + offsetCase) - (predict[i].value.recovered + offsetRecovered) - (predict[i].value.deaths + offsetDeath) );
                        
                    }
                    
                } else {
                    
                    predictCases.push(null);
                    predictRecovered.push(null);
                    predictActive.push(null);
                    
                }
                
            }
            
      
            return [
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
                    name : 'mash',
                    data : mashCases
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
                }
            ];
              
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
                },
                'mash': {
                    lineSmooth: Chartist.Interpolation.none(),
                    showPoint: false,
                    showArea: true
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
                      
                      return (differenceValue) ? `+${differenceValue}` : '';
                  }
                })
              ],
            chartPadding: {
                right: 40
            },
            low: 0
        });
        
        
        this._chart.on('created', function(e,i) {
                        
            const points = document.querySelectorAll('.ct-series-c .ct-point');
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
        
        
        
        return this;
        
    }
    
}