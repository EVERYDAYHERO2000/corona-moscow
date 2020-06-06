const fetch = require(`node-fetch`)
const fs = require(`fs`)

const jsdom = require(`jsdom`)
const { JSDOM } = jsdom

function strToNum (str) {
  return +(str.replace(` `, ``))
}


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

      tempArr.push(+current);

  }

  if (steps) tempArr = interpolation(tempArr, steps);

  return tempArr;

}


module.exports = function (cb) {

  Promise.all([
    fetch(`https://docs.google.com/spreadsheets/d/e/2PACX-1vRTFB2bR2DukV661JBclYxm4BFqI8dArud1cYlvVcmpurGH1_AQZQkTXSBNvfnQg1q9UvrhVYHA_HMy/pub?gid=165609775&single=true&output=tsv`)
  ]).then(async ([data]) => {
    const csv = await data.text()

    return [csv]
  }).then(([csv]) => {

    csv = csv.replace(/	/gi, '||').replace(/,/gi,'.').split('\r\n')

    ///

    let temp = {
      moscowHospitalised : [],
      moscowHospitalisedCovid : [],
      moscowHospitalisedPn : [],
      moscowICU : [],
      moscowVentilation : []
    }

    for (var i = 2; i < csv.length; i++){

      let row = csv[i].split('||');

      if (+row[4] > 0) temp.moscowHospitalisedCovid.push(+row[4])
      if (+row[5] > 0) temp.moscowHospitalisedPn.push(+row[5])
      if (+row[53] > 0) temp.moscowICU.push(+row[53])
      if (+row[54] > 0) temp.moscowVentilation.push(+row[54])
      if (+row[56] > 0) temp.moscowHospitalised.push(+row[56])

    }  

    temp.moscowHospitalised = interpolation (temp.moscowHospitalised, 5);  
    temp.moscowHospitalisedCovid = interpolation (temp.moscowHospitalisedCovid, 5);    
    temp.moscowHospitalisedPn = interpolation (temp.moscowHospitalisedPn, 5);
    temp.moscowICU = interpolation (temp.moscowICU, 5);
    temp.moscowVentilation = interpolation (temp.moscowVentilation, 5);

    
    ///

    

    let stats = {
      city: [],
      oblast: []
    }

    let data = []

    for (var i = 2; i < csv.length; i++){

      let row = csv[i].split('||');
      let date = +(row[0].split('.')[2] + row[0].split('.')[1] + row[0].split('.')[0]);
      let month = {
        1  : 'января',
        2  : 'февраля',
        3  : 'марта',
        4  : 'апреля',
        5  : 'мая',
        6  : 'июня',
        7  : 'июля',
        8  : 'августа',
        9  : 'сентября',
        10 : 'октября',
        11 : 'ноября',
        12 : 'декабря'
      }

      stats.city.push({
        date : date,
        total : {
          cases : +row[9],
          recovered : +row[11],
          deaths : +row[13],
          active : +row[15]
        },
        new : {
          cases : +row[10],
          recovered : +row[12],
          deaths : +row[14]
        }
      });

      stats.oblast.push({
        date : date,
        total : {
          cases : +row[30],
          recovered : +row[32],
          deaths : +row[34],
          active : +row[36]
        },
        new : {
          cases : +row[31],
          recovered : +row[33],
          deaths : +row[35]
        }
      });

      data.push({
        dateIndex : date,
        date : `${row[0].split('.')[0]} ${month[+row[0].split('.')[1]]}`,
        moscow : {
          total : {
            cases : +row[9],
            recovered : +row[11],
            deaths : +row[13],
            active : +row[15],
            activePn : +row[8], 
            hospitalisedBeds : +row[55],
            hospitalised : (temp.moscowHospitalised[i-2]) ? +temp.moscowHospitalised[i-2].toFixed() : 0,
            hospitalisedCovid : (temp.moscowHospitalisedCovid[i-2]) ? +temp.moscowHospitalisedCovid[i-2].toFixed() : 0,//+row[4],
            hospitalisedPn : (temp.moscowHospitalisedPn[i-2]) ? +temp.moscowHospitalisedPn[i-2].toFixed() : 0,//+row[5],
            hospitalIcu : (temp.moscowICU[i-2]) ? +temp.moscowICU[i-2].toFixed() : 0,
            hospitalVentilation : (temp.moscowVentilation[i-2]) ? +temp.moscowVentilation[i-2].toFixed() : 0,
            noSymptoms : +row[7]
          },
          new : {
            cases : +row[10],
            recovered : +row[12],
            deaths : +row[14],
            noSymptoms : +row[6]
          }
        },
        oblast : {
          total : {
            cases : +row[30],
            recovered : +row[32],
            deaths : +row[34],
            active : +row[36]
          },
          new : {
            cases : +row[31],
            recovered : +row[33],
            deaths : +row[35]
          }
        },
        tests : {
          allTotal: +row[28] + +row[39],
          moscowTotal: +row[28],
          oblastTotal: +row[39],
        },
        age : {
          age_18_45 : +row[18],
          age_46_65 : +row[19],
          age_66_79  : +row[20],
          age_80 : +row[21],
          age_0_17 : +row[22],
          cases_18_45 : +row[23],
          cases_46_65 : +row[24],
          cases_66_79 : +row[25],
          cases_80 : +row[26],
          cases_0_17 : +row[27],
          newCases_18_45 : +row[46],
          newCases_46_65 : +row[47],
          newCases_66_79 : +row[48],
          newCases_80 : +row[49],
          newCases_0_17 : +row[50]
        },
        moscowHospital : {
          totalHosp : +row[1],
          totalCovidHosp : +row[2],
          totalPnHosp : +row[3],
          totalICU : +row[51],
          totalVentilation : +row[52]
        },
        mortality : {
          moscow : {
            r1 : +row[16],
            r2 : +row[17],
            r3 : +row[41]  
          },
          oblast : {
            r1 : +row[37],
            r2 : +row[38],
            r3 : +row[42]     
          },
          moscowAndOblast: {
            r1 : +row[43],
            r2 : +row[44],
            r3 : +row[45] 
          }
        }
      })

      

    }

    if (data) {
      fs.writeFileSync(`./data/data.json`, JSON.stringify(data.reverse()), `utf-8`);
    } else {
      console.log('Google doc data failure');
    }


    if (stats.city.length && stats.oblast.length) {
      fs.writeFileSync(`./data/stats.json`, JSON.stringify(stats), `utf-8`);
    } else {
      console.log('Google doc data failure');
    }

    return cb()
  }).catch(error => console.log(error))

}


