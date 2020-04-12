export default class Chart {

    constructor() {

        this._data = null;
        
        
        return this;
    }  
    
    setMap(map) {
        
        this._map = map;
        
        return this;
    }
    
    setData(data) {
        
        const _this = this;
        
        this._data = (function(data){
            
            const cloneData = JSON.parse(JSON.stringify(data));
            const byDate = {};
            const result = [];
            
            
            for (var i = 0; i < cloneData.length; i++){
                
                if (!byDate[cloneData[i].date]) {
                    byDate[cloneData[i].date] = [];
                }
                
                byDate[cloneData[i].date].push(cloneData[i]);
                
            }
            
            let countLength = 0;
            
            for (var i in byDate) {
                
                countLength += byDate[i].length;
                result.push({
                    date : (function(date){
                        
                        let arr = [
                            date.substr(0, 4) + '',
                            date.substr(4,2) + '',
                            date.substr(6,2) + ''
                        ]
                        
                        return `${arr[2]}.${arr[1]}`
                        
                    })(i),
                    length : countLength
                });
                
            }
                            
            return result;
            
        })(data);
        
        
        const labels = (function (data) {
         
            var arr = [];
            for (var i = 0; i < data.length; i++ ) {
                arr.push( data[i].date );
            }
      
            return arr;
              
        })(this._data);
        

        
        const series = (function (data) {
         
            var arr = [];
            for (var i = 0; i < data.length; i++ ) {
                arr.push( data[i].length );
            }
      
            return arr;
              
        })(this._data);
        
        
        this._chart = new Chartist.Line('#chart', {
            labels: labels,
            series: [series]
          }, {
            fullWidth: true,
            chartPadding: {
              right: 40
            }
          });
        
        
        this._chart.on('created', function() {
            
            const points = document.querySelectorAll('.ct-point');
        
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
                    
                    _this._map.drawData(step, 10000);
                    
                });
            
            }

        });
        
        
        
        return this;
        
    }
    
}