const fetch = require(`node-fetch`)
const fs = require(`fs`)

const jsdom = require(`jsdom`)
const { JSDOM } = jsdom

function strToNum (str) {
  return +(str.replace(` `, ``))
}

function getStats (array, rows) {
  for (const row of rows) {
    const cells = row.querySelectorAll(`td`)

    if (!cells.length) continue;

    const date = cells[0].textContent.split(`.`)

    array.push({
      date: +`${date[2]}${date[1]}${date[0]}`,
      total: {
        cases: strToNum(cells[1].textContent),
        deaths: strToNum(cells[5].textContent),
        recovered: strToNum(cells[9].textContent)
      },
      new: {
        cases: strToNum(cells[2].textContent),
        deaths: strToNum(cells[6].textContent),
        recovered: strToNum(cells[10].textContent)
      }
    })
  }
}



module.exports = function (cb) {

  Promise.all([
    fetch(`https://docs.google.com/spreadsheets/d/e/2PACX-1vRTFB2bR2DukV661JBclYxm4BFqI8dArud1cYlvVcmpurGH1_AQZQkTXSBNvfnQg1q9UvrhVYHA_HMy/pub?gid=165609775&single=true&output=tsv`)
  ]).then(async ([data]) => {
    const csv = await data.text()

    return [csv]
  }).then(([csv]) => {

    csv = csv.replace(/	/gi, '||').replace(/,/gi,'.').split('\r\n')

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
            hospitalised : +row[4],
            hospitalisedPn : +row[5],
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
        },
        moscowHospital : {
          totalHosp : +row[1],
          totalCovidHosp : +row[2],
          totalPnHosp : +row[3],
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


