import DataSet from "./data-set.js";
import Chart from "./chart.js";
import setResponsiveHeight from "./responsiveHeight.js";

(function(){
    setResponsiveHeight();

    const dataSet = new DataSet();

    const allCases = new Chart('#allCases');
    const newCases = new Chart('#newCases');
    const testsPerPeriod = new Chart('#testsPerPeriod');
    const detectability = new Chart('#detectability');
    const mortalyty = new Chart('#mortalyty');

    dataSet.load(function(data, predict){

        allCases.setData(data, predict, 'all');

        newCases.setData(data, predict, 'new');

        testsPerPeriod.setData(data, predict, 'test');

        detectability.setData(data, predict, 'detectability');

        mortalyty.setData(data, predict, 'mortalyty');

    });

})()
