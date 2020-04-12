import DataSet from "./data-set.js";
import Map from "./map.js";
import Chart from "./chart.js";
import setResponsiveHeight from "./responsiveHeight.js";

(function(){
    setResponsiveHeight();

    const dataSet = new DataSet('./data/data.json');
    const chart = new Chart();

    const map = new Map({
        lat: 55.751244,
        lon: 37.618423,
        zoom: 10,
    });

    dataSet.load(function(data){

        map.setChart(chart).setData(data);

        chart.setMap(map).setData(data);

        map.drawData();

    });

})()
