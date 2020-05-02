import DataSet from "./data-set.js";
import Map from "./map.js";
import Chart from "./chart.js";
import setResponsiveHeight from "./responsiveHeight.js";
import Content from "./content.js";

(function(){
    setResponsiveHeight();

    const dataSet = new DataSet();
    const chart = new Chart();
    const content = new Content();

    const map = new Map({
        lat: 56.4,
        lon: 37.618423,
        zoom: 7,
    });

    dataSet.load(function(data, predict){
        
        content.setData(data);

        map.setChart(chart).setContent(content).setData(data);

        chart.setMap(map).setContent(content).setData(data, predict, 'all');

        map.drawData();

    });

})()
