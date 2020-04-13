import DataSet from "./data-set.js";
import Map from "./map.js";
import Chart from "./chart.js";
import setResponsiveHeight from "./responsiveHeight.js";

(function(){
    setResponsiveHeight();

    const dataSet = new DataSet();
    const chart = new Chart();

    const map = new Map({
        lat: 55.751244,
        lon: 37.618423,
        zoom: 10,
    });

    dataSet.load(function(data){
        
        console.log(data[1])

        map.setChart(chart).setData(data[0]);

        chart.setMap(map).setData(data[0]);

        map.drawData();

    });

})()
