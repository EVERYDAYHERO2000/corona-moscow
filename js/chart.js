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
    
    setData(data) {
        
        const _this = this;
        
        
        
        this._data = data
        
        
        const labels = (function (data) {
         
            var arr = [];
            for (var i = 0; i < data.length; i++ ) {
                
                arr.push( data[i].date );
                
            }
      
            return arr;
              
        })(this._data);
        

        
        const series = (function (data) {
         
            const allCases = [];
            const allDeaths = [];
            const allRecovered = [];
            
            const mashCases = [];
            
            for (var i = 0; i < data.length; i++ ) {
                allCases.push( data[i].moscowAndOblast.total.cases );
                allDeaths.push( data[i].moscowAndOblast.total.deaths );
                allRecovered.push( data[i].moscowAndOblast.total.recovered );
            }
            
            
            for (var i = 0; i < data.length; i++ ) {
                
                const length = (data[i].points.new.length) ? data[i].points.total.length : null;
                
                mashCases.push( length ); 
            }
      
            return [
                {
                    name : 'series-1',
                    data : allDeaths
                }, {
                    name : 'series-2',
                    data : allRecovered
                }, {
                    name : 'series-3',
                    data : allCases
                }, {
                    name : 'series-4',
                    data : mashCases
                }
            ];
              
        })(this._data);
        
        this._chart = new Chartist.Line('#chart', {
            labels: labels,
            series: series
        }, {
            fullWidth: true,
            series: {
                'series-1': {
                    lineSmooth: Chartist.Interpolation.none(),
                    showPoint: false
                },
                'series-2': {
                    lineSmooth: Chartist.Interpolation.none(),
                    showPoint: false
                },
                'series-3': {
                    lineSmooth: Chartist.Interpolation.none()
                },
                'series-4': {
                    lineSmooth: Chartist.Interpolation.none(),
                    showPoint: false,
                    showArea: true
                }
            },
            plugins: [
                Chartist.plugins.ctPointLabels({
                  textAnchor: 'middle',
                  labelInterpolationFnc: function(data) {
                      
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
        
        
        this._chart.on('created', function() {
            
            const points = document.querySelectorAll('.ct-series-c .ct-point');
            const dateLabels = document.querySelectorAll('.ct-labels foreignObject[y="270"] span');
            
            dateLabels[0].classList.add('visible');
            dateLabels[dateLabels.length - 1].classList.add('visible');
        
            let count = 0;
        
            for (var p of points) {
                
                p.setAttribute('data-step', count);
                
                count++
            
                p.addEventListener('click', function () {
                    
                    const step = new Number (this.getAttribute('data-step')) + 0;
                    
                    for (var p of points) {
                        
                        p.classList.remove('ct-point_active');
                        
                    }
                    
                    this.classList.add('ct-point_active');
                    
                    clearInterval(_this._map._animationTimer);
                    
                    _this._content.drawData(step);
                    
                    _this._map.drawData(step, 10000);
                    
                    
                    
                });
            
            }

        });
        
        
        
        return this;
        
    }
    
}