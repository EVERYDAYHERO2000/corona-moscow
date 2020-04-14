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
        deaths: strToNum(cells[4].textContent),
        recovered: strToNum(cells[7].textContent)
      },
      new: {
        cases: strToNum(cells[2].textContent),
        deaths: strToNum(cells[5].textContent),
        recovered: strToNum(cells[8].textContent)
      }
    })
  }
}

module.exports = function (cb) {
  Promise.all([
    fetch(`https://coronavirus.mash.ru/data.json`),
    fetch(`https://coronavirus.mash.ru/`),
    fetch(`https://ru.wikipedia.org/wiki/%D0%A5%D1%80%D0%BE%D0%BD%D0%BE%D0%BB%D0%BE%D0%B3%D0%B8%D1%8F_%D1%80%D0%B0%D1%81%D0%BF%D1%80%D0%BE%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%B5%D0%BD%D0%B8%D1%8F_COVID-19_%D0%B2_%D0%A0%D0%BE%D1%81%D1%81%D0%B8%D0%B8`)
  ]).then(async ([data, page, stats]) => {
    const json = await data.json()
    const html = await page.text()
    const wiki = await stats.text()
    return [json, html, wiki]
  }).then(([json, html, wiki]) => {
    const document = (new JSDOM(html)).window.document
    const tableRows = document.querySelectorAll(`tr`)

    let data = []
    let jsonData = new Map()

    for (const feature of json.features) {
      const coords = feature.geometry.coordinates
      jsonData.set(feature.properties.hintContent, [+coords[0], +coords[1]])
    }

    for (const row of tableRows) {
      const cells = row.querySelectorAll(`td`)

      if (cells.length >= 3) {
        const address = `${cells[0].textContent}, ${cells[1].textContent}`
        const date = cells[2].textContent.split(`.`)

        data.push({
          point: jsonData.get(`Москва, ${address}`),
          address,
          date: +`${date[2]}${date[1]}${date[0]}`
        })
      }
    }

    const wikiDocument = (new JSDOM(wiki)).window.document
    const wikiTables = wikiDocument.querySelectorAll(`.wikitable`)
    const moscowCityRows = wikiTables[1].querySelectorAll(`tr`)
    const moscowOblastRows = wikiTables[2].querySelectorAll(`tr`)

    let stats = {
      city: [],
      oblast: []
    }

    getStats(stats.city, moscowCityRows)
    getStats(stats.oblast, moscowOblastRows)


    if (data.length) {
      fs.writeFileSync(`./data/data.json`, JSON.stringify(data), `utf-8`);
    } else {
      console.log('Mash data failure');
    }

    if (stats.city.length && stats.oblast.length) {
      fs.writeFileSync(`./data/stats.json`, JSON.stringify(stats), `utf-8`);
    } else {
      console.log('Wikipedia data failure');
    }

    console.log('Done')

    return cb()
  }).catch(error => console.log(error))
}
