const fs = require(`fs`);

fs.readFile('./data/stats.json', 'utf8', function(err, contents) {
    
    const result = objToCsv( JSON.parse(contents) );
    
    console.log('stats.csv created')
    
    fs.writeFileSync(`./data/stats.csv`, result, `utf-8`);
    
});


function objToCsv (obj) {
    
    let moscowPoint = [55.755814, 37.617635].join(',');
    let header = `Province/State,Country/Region,Lat,Long`;
    let body = [`Moscow and Oblast (Cases),Russia,${moscowPoint}`,`Moscow and Oblast (Deaths),Russia,${moscowPoint}`,`Moscow and Oblast (Recovered),Russia,${moscowPoint}`]
    let casesByDates = {};
    let deathsByDates = {};
    let recoveredByDates = {};
    let result = {
        date : [],
        cases : [],
        deaths : [],
        recovered : []
    }
   
    //city
    for (var i = 0; i < obj.city.length; i++) {
        
        let date = [
            (obj.city[i].date + '').substr(4,2) + '',
            (obj.city[i].date + '').substr(6,2) + '',
            (obj.city[i].date + '').substr(2,2) + ''
        ].join('/');
        
        let cases = obj.city[i].total.cases;
        let deaths = obj.city[i].total.deaths;
        let recovered = obj.city[i].total.recovered;
        
        if (!casesByDates[date]) casesByDates[date] = 0;
        if (!deathsByDates[date]) deathsByDates[date] = 0;
        if (!recoveredByDates[date]) recoveredByDates[date] = 0;
        
        casesByDates[date] += cases;
        deathsByDates[date] += deaths;
        recoveredByDates[date] += recovered;
    }
    
    //oblast
    for (var i = 0; i < obj.oblast.length; i++) {
        
        let date = [
            (obj.oblast[i].date + '').substr(4,2) + '',
            (obj.oblast[i].date + '').substr(6,2) + '',
            (obj.oblast[i].date + '').substr(2,2) + ''
        ].join('/');
        
        let cases = obj.oblast[i].total.cases;
        let deaths = obj.oblast[i].total.deaths;
        let recovered = obj.oblast[i].total.recovered;
        
        if (!casesByDates[date]) casesByDates[date] = 0;
        if (!deathsByDates[date]) deathsByDates[date] = 0;
        if (!recoveredByDates[date]) recoveredByDates[date] = 0;
        
        casesByDates[date] += cases;
        deathsByDates[date] += deaths;
        recoveredByDates[date] += recovered;
        
    }
    
    
    
    //obj to arr
    for (var i in casesByDates) {
        
        result.date.push(i);
        result.cases.push(casesByDates[i]);
        result.deaths.push(deathsByDates[i]);
        result.recovered.push(recoveredByDates[i]);
    }
    
    result.date.reverse().join(',');
    result.cases.reverse().join(',');
    result.deaths.reverse().join(',');
    result.recovered.reverse().join(',');
    
    
    return [ [header,result.date].join(','), 
             [body[0],result.cases].join(','), 
             [body[1],result.deaths].join(','), 
             [body[2],result.recovered].join(',') 
           ].join('\n');
    
}