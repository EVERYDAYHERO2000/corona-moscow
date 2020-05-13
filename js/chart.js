export default class Chart {

    constructor(id) {

        this.id = id || '#chart';

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
        
        const points = document.querySelectorAll('.ct-cases .ct-point, .ct-newCases .ct-point');

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
        this._predictLength = 13;

        this._step = this._data.length - 1;


        this._x1 = null;
        this._x2 = null;
        
        
        const labels = this._labels || (function (data, predict) {
         
            let arr = [];
            
            for (var i = 0; i < data.length + _this._predictLength; i++ ) {
                
                

                arr.push( predict[i].date );
            }
            
            return arr;
              
        })(this._data, this._predict);   
        
        this._labels = labels;

        this._points = [];
        
        const series = (function (data, predict) {

            const moscowPopulation = 12692466;
            const oblastPopulation = 7690863;
            const totalPopulation = moscowPopulation + oblastPopulation;

            const allCases = [];
            const newCases = [];
            const newDeaths = [];
            const allDeaths = [];
            const newRecovered = [];
            const allRecovered = [];
            const activeCases = [];
            const predictNewCases = [];
            const predictAllCases = [];
            const predictNewRecovered = []; 
            const predictAllRecovered = [];
            const predictNewDeaths = [];
            const predictAllDeaths = [];
            const predictActive = [];
            let newCasesInterpolated = null;
            let newRecoveredInterpolated = null;
            let newDeathsInterpolated = null;
            const allTests = [];
            const casesDetectability = [];
            const mortalytyRate_1 = [];
            const mortalytyRate_2 = [];
            let mortalytyRate_3 = [];

            const casesRate = [];
            const recoveredRate = [];
            const deathsRate = [];
            
            

            
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

                allTests.push( data[i].tests.allTotal );

                casesDetectability.push( data[i].moscowAndOblast.total.cases / data[i].tests.allTotal * 100 );
                
                mortalytyRate_1.push( data[i].moscowAndOblast.total.deaths / (data[i].moscowAndOblast.total.deaths + data[i].moscowAndOblast.total.recovered) * 100 );
                mortalytyRate_2.push( data[i].moscowAndOblast.total.deaths / data[i].moscowAndOblast.total.cases * 100 );
                mortalytyRate_3.push( ( ( data[i].moscowAndOblast.total.deaths / (data[i].moscowAndOblast.total.deaths + data[i].moscowAndOblast.total.recovered) ) + ( data[i].moscowAndOblast.total.deaths / data[i].moscowAndOblast.total.cases ) ) / 2 * 100 );

                let prevDay = (data[i - 1]) ? data[i - 1] : data[i];

                casesRate.push( (i > 20) ? (data[i].moscowAndOblast.total.cases / prevDay.moscowAndOblast.total.cases * 100) - 100 : null );
                recoveredRate.push( (i > 20) ? (data[i].moscowAndOblast.total.recovered / prevDay.moscowAndOblast.total.recovered * 100) - 100 : null );
                deathsRate.push( (i > 20) ? (data[i].moscowAndOblast.total.deaths / prevDay.moscowAndOblast.total.deaths * 100) - 100 : null );

                

                
            }
            
            newCasesInterpolated = interpolation(newCases, 10);
            newRecoveredInterpolated = interpolation(newRecovered, 10);
            newDeathsInterpolated = interpolation(newDeaths, 10);   


            mortalytyRate_3 = interpolation(mortalytyRate_3, 3);
            
            
            
            let offsetNewCase = (newCasesInterpolated[allCases.length - 1] > predict[allCases.length - 1].value.newCases ) ? 
            (newCasesInterpolated[allCases.length - 1] - predict[allCases.length - 1].value.newCases) : 
            -(predict[allCases.length - 1].value.newCases - newCasesInterpolated[allCases.length - 1]);

            let offsetNewRecovered = (newRecoveredInterpolated[allCases.length - 1] > predict[allCases.length - 1].value.newRecovered ) ? 
            (newRecoveredInterpolated[allCases.length - 1] - predict[allCases.length - 1].value.newRecovered) : 
            -(predict[allCases.length - 1].value.newRecovered - newRecoveredInterpolated[allCases.length - 1]);

            let offsetNewDeaths = (newDeathsInterpolated[allCases.length - 1] > predict[allCases.length - 1].value.newDeaths ) ? 
            (newDeathsInterpolated[allCases.length - 1] - predict[allCases.length - 1].value.newDeaths) : 
            -(predict[allCases.length - 1].value.newDeaths - newDeathsInterpolated[allCases.length - 1]);

            
            let offsetAllCase = (allCases[allCases.length - 1] > predict[allCases.length - 1].value.cases ) ? 
                (allCases[allCases.length - 1] - predict[allCases.length - 1].value.cases) : 
                -(predict[allCases.length - 1].value.cases - allCases[allCases.length - 1]);
            
            let offsetAllRecovered = (allRecovered[allRecovered.length - 1] > predict[allRecovered.length - 1].value.recovered ) ? 
                (allRecovered[allCases.length - 1] - predict[allCases.length - 1].value.recovered) : 
                -(predict[allCases.length - 1].value.recovered - allRecovered[allRecovered.length - 1]);
            
            let offsetAllDeath = (allDeaths[allDeaths.length - 1] > predict[allDeaths.length - 1].value.deaths ) ? 
                (allDeaths[allDeaths.length - 1] - predict[allDeaths.length - 1].value.deaths) : 
                -(predict[allDeaths.length - 1].value.deaths - allDeaths[allDeaths.length - 1]); 

            
            
            
            
            for (var i = 0; i < predict.length; i++) {
                
                if (i >= allCases.length - 1 ) {
                    
                    if (i < allCases.length + _this._predictLength){
                    
                        
                        predictNewCases.push(predict[i].value.newCases + offsetNewCase);
                        predictNewRecovered.push(predict[i].value.newRecovered + offsetNewRecovered);
                        predictNewDeaths.push(predict[i].value.newDeaths + offsetNewDeaths);

                        predictAllCases.push(predict[i].value.cases + offsetAllCase);
                        predictAllDeaths.push(predict[i].value.deaths + offsetAllDeath);
                        predictAllRecovered.push(predict[i].value.recovered + offsetAllRecovered);
                        predictActive.push( (predict[i].value.cases + offsetAllCase) - (predict[i].value.recovered + offsetAllRecovered) - (predict[i].value.deaths + offsetAllDeath) );

                        
                        
                    }
                    
                } else {

                    predictNewCases.push(null);
                    predictNewRecovered.push(null);
                    predictNewDeaths.push(null);
                    
                    predictAllCases.push(null);
                    predictAllDeaths.push(null);
                    predictAllRecovered.push(null);
                    predictActive.push(null);
                    
                }
                
            }

            
            
            let result = null;

            if (_this._type == 'all') {

                result = [
                    {
                        name : 'deaths',
                        meta : 'смертей',
                        color: 'black',
                        data : allDeaths
                    }, {
                        name : 'recovered',
                        meta : 'выздоровлений',
                        color: 'green',
                        data : allRecovered 
                    }, {
                        name : 'cases',
                        meta : 'заражений',
                        color: 'red',
                        data : allCases
                    }, {
                        name : 'active',
                        meta : 'болеют',
                        color: 'red-light',
                        data : activeCases
                    }, {
                        name : 'predictCases',
                        meta : 'прогноз заражений',
                        color: 'red',
                        data : predictAllCases
                    }, {
                        name : 'predictRedcovered',
                        meta : 'прогноз выздоровлений',
                        color: 'green',
                        data : predictAllRecovered
                    }, {
                        name : 'predictActive',
                        meta : 'прогноз болеющих',
                        color: 'red-light',
                        data : predictActive
                    }, {
                        name : 'predictDeaths',
                        meta : 'прогноз смертей',
                        color: 'black',
                        data : predictAllDeaths
                    }
                ];

            }

            if (_this._type == 'new') {

                result = [
                    {
                        name : 'deaths',
                        meta : 'смертей',
                        color: 'black',
                        data : newDeaths
                    }, {
                        name : 'newDeathsInterpolated',
                        off : true,
                        data : newDeathsInterpolated
                    }, {
                        name : 'predictNewDeaths',
                        meta : 'прогноз смертей',
                        color: 'black',
                        data : predictNewDeaths
                    }, {
                        name : 'recovered',
                        meta : 'выздоровлений',
                        color: 'green',
                        data : newRecovered
                    }, {
                        name : 'newCasesInterpolated',
                        off : true,
                        data : newCasesInterpolated
                    },{
                        name : 'predictNewCases',
                        meta : 'прогноз заражений',
                        color: 'red',
                        data : predictNewCases
                    }, {
                        name : 'newRecoveredInterpolated',
                        off : true,
                        data : newRecoveredInterpolated    
                    }, {
                        name : 'predictNewRecovered',
                        meta : 'прогноз выздоровлений',
                        color: 'green',
                        data : predictNewRecovered    
                    }, {
                        name : 'newCases',
                        meta : 'заражений',
                        color: 'red',
                        data : newCases
                    }
                ];

            }

            if (_this._type == 'test') {
                result = [
                    {
                        name : 'testPerPopulation',
                        meta : 'тестов',
                        color: 'blue',
                        data : allTests
                    },
                    {
                        name : 'cases',
                        meta : 'заражений',
                        color: 'red',
                        data : allCases
                    },
                    {
                        name : 'predictCases',
                        meta : 'прогноз заражений',
                        color: 'red',
                        data : predictAllCases
                    }
                ]    
            }  
            
            if (_this._type == 'detectability') {

                result = [
                    {
                        name : 'casesDetectability',
                        meta : 'выявляемость',
                        color: 'red',
                        unit : 'percent',
                        data : casesDetectability
                    }
                ]

            }

            if (_this._type == 'mortalyty') {

                result = [
                    {
                        name : 'mortalytyRate_1',
                        meta : 'летальность 1',
                        color: 'black',
                        unit : 'percent',
                        data : mortalytyRate_1
                    },
                    {
                        name : 'mortalytyRate_2',
                        meta : 'летальность 2 (ВОЗ)',
                        color: 'black-light',
                        unit : 'percent',
                        data : mortalytyRate_2
                    },
                    {
                        name : 'mortalytyRate_3',
                        meta : 'летальность 3',
                        color: 'black',
                        unit : 'percent',
                        data : mortalytyRate_3
                    }
                ]

            }

            if (_this._type == 'rate') {

                result = [
                    {
                        name : 'cases',
                        meta : 'заражений',
                        color: 'red',
                        unit : 'percent',
                        data : casesRate
                    },
                    {
                        name : 'recovered',
                        meta : 'выздоровлений',
                        color: 'green',
                        unit : 'percent',
                        data : recoveredRate
                    },
                    {
                        name : 'deaths',
                        meta : 'смертей',
                        color: 'black',
                        unit : 'percent',
                        data : deathsRate
                    }
                ]

            }

            return result;
              
        })(this._data, this._predict);

        let id = this.id || '#chart';
        
        this._chart = new Chartist.Line(id, {
            labels: labels,
            series: series
        }, {
            fullWidth: true,
            series: {
                'deaths': {
                    lineSmooth: Chartist.Interpolation.none()
                },
                'recovered': {
                    lineSmooth: Chartist.Interpolation.none()
                },
                'cases': {
                    lineSmooth: Chartist.Interpolation.none()
                },
                'newCases': {
                    lineSmooth: Chartist.Interpolation.none()
                },
                'mortalytyRate_1': {
                    lineSmooth: Chartist.Interpolation.none()
                },
                'mortalytyRate_2': {
                    lineSmooth: Chartist.Interpolation.none()
                }   
            },
            plugins: [
                Chartist.plugins.ctPointLabels({
                  textAnchor: 'middle',
                  labelInterpolationFnc: function(data) {

                      let result = '';  
                      


                      let currentValue = data.value.y;
                      let prevValue = (data.series.data[data.index - 1]) ? data.series.data[data.index - 1] : 0;
                      let differenceValue = Math.abs(currentValue - prevValue);  

                      if (data.series.name == 'newCases' && data.series.data[data.index - 4]) {

                         let step1 = Math.abs(data.series.data[data.index] - data.series.data[data.index - 1]);
                         let step2 = Math.abs(data.series.data[data.index - 1] - data.series.data[data.index - 2]);
                         let step3 = Math.abs(data.series.data[data.index - 2] - data.series.data[data.index - 3]);
                         let step4 = Math.abs(data.series.data[data.index - 3] - data.series.data[data.index - 4]);

                         let step5 = Math.abs(step1 - step2);
                         let step6 = Math.abs(step3 - step4);

                         if (step5 > step6 && Math.abs(step5 - step6) > 100) {
                             
                            data.element._node.nextSibling.classList.add('ct-label_visible');
                       
                         }    

                         result = `+${format(currentValue)}`;

                      }

                      _this._points.push({
                          series : data.series,
                          meta : (data.series.meta) ? data.series.meta : '',
                          value : (data.series.unit && data.series.unit == 'percent') ? `${data.value.y.toFixed(2)}%` : format(data.value.y),
                          off : (data.series.off) ? data.series.off : false,
                          color : (data.series.color) ? data.series.color : null,
                          x : data.x,
                          elem : data.element._node,
                          date : data.axisX.ticks[data.index]
                      });

                      if (!_this._x1) {

                        _this._x1 = data.x

                      } else {

                        if (!_this._x2) {

                            _this._x2 = data.x

                        }    

                      }

                      if (data.series.name == 'cases' && data.index%5 == 0 ) {

                        data.element._node.nextSibling.classList.add('ct-label_visible');

                        result = format(currentValue)

                      }

                      if (data.series.name == 'testPerPopulation' && data.index%5 == 0 ) {

                        data.element._node.nextSibling.classList.add('ct-label_visible');

                        result = format(currentValue)

                      }

                      if (data.series.name == 'casesDetectability' && data.index%5 == 0 ) {
                        
                        data.element._node.nextSibling.classList.add('ct-label_visible');

                        result = `${currentValue.toFixed(2)}%`  

                      }

                      if (data.series.name == 'mortalytyRate_1' && data.index%5 == 0 ) {

                        data.element._node.nextSibling.classList.add('ct-label_visible');

                        result = `${currentValue.toFixed(2)}%`

                      } 

                      return result;
                  }
                })
              ],
            chartPadding: {
                right: (_this.id == '#chart') ? 40 : 80,
                left: (_this.id == '#chart') ? 20 : 40
            },
            low: 0
        });

       

        function format(value) {

            value = (/\.\d/.test(value)) ? value + '' : value + '.00';
            value = (value).replace(/\d(?=(\d{3})+\.)/g, '$& ').split('.')[0]
            
            return value;
        }

        
        this._chart.on('created', function(e,i) {

            const lines = document.querySelectorAll(`${_this.id} .ct-series`);

            let hoverTimer = null;

            for (var l of lines) {

                let name = l.getAttribute('ct:series-name')

                l.classList.add('ct-' + name);

            }
                
            const points = document.querySelectorAll(`${_this.id} .ct-cases .ct-point, ${_this.id} .ct-newCases .ct-point`);

            const dateLabels = document.querySelectorAll(`${_this.id} .ct-label.ct-horizontal`);
            
            dateLabels[0].classList.add('visible');    
            dateLabels[_this._data.length - 1].classList.add('visible');
            dateLabels[dateLabels.length - 1].classList.add('visible');
        
            let count = 0;
        
            for (var p of points) {
                
                p.setAttribute('data-step', count);


                
                count++
            
                p.addEventListener('click', function () {
                    
                    const step = new Number (this.getAttribute('data-step')) + 0;
                    
                    _this._step = step

                    _this.setStep(step);
                    
                    _this._map._playButton.setAttribute('data-state', 'pause');
                    
                    clearInterval(_this._map._animationTimer);
                    
                    _this._content.drawData(step);
                    
                    _this._map.drawData(step);
                    
                    
                    
                });
            
            }
            
            _this.setStep(_this._data.length - 1);

            


            /////

            const screen = document.querySelector(_this.id).closest('.screen');

        if (screen) {

            const chart = screen.querySelector(_this.id);

            let horisontalLine  = document.createElement('div');
            horisontalLine.classList.add('screen__horisontalLine');
            chart.appendChild(horisontalLine);

            screen.addEventListener('mousemove',function(e){

                horisontalLine.style.transform = `translateX(${e.clientX}px)`
                
                clearInterval(hoverTimer);

                hoverTimer = setInterval(function(){

                    let date = '';

                    let content = '';

                for (var el = 0; el < _this._points.length; el++) {

                    let elem = _this._points[el].elem;

                    let position = _this._points[el].x;

                    let d = _this._x2 - _this._x1;

                    

                    if ( position > e.clientX - d && position < e.clientX ){

                        if (!_this._points[el].off) {

                            date = _this._points[el].date;

                            content += `<div class="color-${_this._points[el].color}">${_this._points[el].value} ${_this._points[el].meta}</div>`;
                        
                            elem.classList.add('ct-point_hover');

                        }

                    } else {

                        elem.classList.remove('ct-point_hover');  

                    }
                    

                }

                    horisontalLine.innerHTML = (date) ? `<div class="screen__graph-description"><div>${date}</div>${content}</div>` : '';

                    let screenGraphDescription = horisontalLine.querySelector('.screen__graph-description');
                    
                    if (screenGraphDescription) {

                        if (horisontalLine.getBoundingClientRect().left + screenGraphDescription.clientWidth > document.body.clientWidth) {
                        
                            screenGraphDescription.classList.add('screen__graph-description_right');

                        } else {
        
                            screenGraphDescription.classList.remove('screen__graph-description_right');
                            
                        }

                    }

                clearInterval(hoverTimer);

                },10)
                
                

            

            })
            
            screen.addEventListener('mouseout',function(e){

                for (var el = 0; el < _this._points.length; el++) {

                    let elem = _this._points[el].elem;

                    elem.classList.remove('ct-point_hover');    

                }
                
                clearInterval(hoverTimer);

            });    

        }


            /////


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

                    _this._content.drawData(_this._step);

                }

            });    
        
        }

        }
        
        return this;
        
    }
    
}