const fs = require(`fs`);

fs.readFile('./data/stats.json', 'utf8', function(err, contents) {
    
    const result = objToCsv( JSON.parse(contents) );
    
    console.log('stats.csv created')
    
    fs.writeFileSync(`./data/stats.csv`, result, `utf-8`);
    
});


function objToCsv (obj) {
    
    let moscowPoint = [55.755814, 37.617635].join(',');
    let header = `Province/State,Country/Region,Lat,Long`;
    let body = `Moscow and Oblast,Russia,${moscowPoint}`
    let byDates = {};
    let result = {
        date : [],
        value : []
    }
   
    //city
    for (var i = 0; i < obj.city.length; i++) {
        
        let date = [
            (obj.city[i].date + '').substr(4,2) + '',
            (obj.city[i].date + '').substr(6,2) + '',
            (obj.city[i].date + '').substr(2,2) + ''
        ].join('/');
        
        let cases = obj.city[i].total.cases;
        
        if (!byDates[date]) byDates[date] = 0;
        
        byDates[date] += cases;
        
    }
    
    //oblast
    for (var i = 0; i < obj.oblast.length; i++) {
        
        let date = [
            (obj.oblast[i].date + '').substr(4,2) + '',
            (obj.oblast[i].date + '').substr(6,2) + '',
            (obj.oblast[i].date + '').substr(2,2) + ''
        ].join('/');
        
        let cases = obj.oblast[i].total.cases;
        
        if (!byDates[date]) byDates[date] = 0;
        
        byDates[date] += cases;
        
    }
    
    
    
    //obj to arr
    for (var i in byDates) {
        
        result.date.push(i);
        result.value.push(byDates[i]);
        
    }
    
    result.date.reverse().join(',');
    result.value.reverse().join(',');
    
    
    return [ [header,result.date].join(','), [body,result.value].join(',') ].join('\n')
    
}