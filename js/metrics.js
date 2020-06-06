import DataSet from "./data-set.js";
import Chart from "./chart.js";
import setResponsiveHeight from "./responsiveHeight.js";

(function(){
    setResponsiveHeight();

    const dataSet = new DataSet();

    const content = document.querySelector('#content-description');

    const allCases = new Chart('#allCases');
    //const allCasesMoscow = new Chart('#allCasesMoscow');
    const newCases = new Chart('#newCases');
    const allCasesLog = new Chart('#allCasesLog');
    const testsPerPeriod = new Chart('#testsPerPeriod');
    const detectability = new Chart('#detectability');
    const mortalyty = new Chart('#mortalyty');
    //const rate = new Chart('#rate');
    const age = new Chart('#age');
    const ageNew = new Chart('#ageNew');
    const totalHosp = new Chart('#totalHosp');
    const totalHospAll = new Chart('#totalHospAll');

    function format(value) {

        value = (/\.\d/.test(value)) ? value + '' : value + '.00';
        value = (value).replace(/\d(?=(\d{3})+\.)/g, '$& ').split('.')[0]
        
        return value;
    }

    dataSet.load(function(data, predict){

        content.innerHTML = `${data[data.length - 1].date} в Москве и МО выявили <b>${format(data[data.length - 1].moscowAndOblast.new.cases)}</b> новых случая коронавируса. Всего с ${data[0].date} выявлено <b>${format(data[data.length - 1].moscowAndOblast.total.cases)}</b> случая. За весь период зафиксировано <b>${format(data[data.length - 1].moscowAndOblast.total.deaths)}</b> летальных исходов, выздоровели <b>${format(data[data.length - 1].moscowAndOblast.total.recovered)}</b> человека.`

        //allCasesMoscow.setData(data, predict, 'allMoscow');

        allCases.setData(data, predict, 'all');

        newCases.setData(data, predict, 'new');

        allCasesLog.setData(data, predict, 'log');

        //rate.setData(data, predict, 'rate');

        totalHosp.setData(data, predict, 'totalHosp');

        totalHospAll.setData(data, predict, 'totalHospAll');


        testsPerPeriod.setData(data, predict, 'test');

        detectability.setData(data, predict, 'detectability');

        mortalyty.setData(data, predict, 'mortalyty');

        age.setData(data, predict, 'age');

        ageNew.setData(data, predict, 'ageNew');


    });

})()
