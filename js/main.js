import DataSet from "./data-set.js";
import Map from "./map.js";

(function(){
  
    const dataSet = new DataSet('./data/data.json');
    const map = new Map({
        lat: 55.751244, 
        lon: 37.618423,
        zoom: 10,
    });
    
    dataSet.load(function(data){
        
        map.setData(data);
        
        map.drawData();
        
    });
  
})()