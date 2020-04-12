const {src, dest, watch, series} = require(`gulp`)
const plumber = require(`gulp-plumber`)
const rename = require(`gulp-rename`)
const fetch = require(`node-fetch`)
const fs = require(`fs`)

const sass = require(`gulp-sass`)
const postcss = require(`gulp-postcss`)
const autoprefixer = require(`autoprefixer`)
const csso = require(`gulp-csso`)
const normalize = require(`node-normalize-scss`)

const jsdom = require(`jsdom`)
const { JSDOM } = jsdom

function styles() {
  return src(`scss/style.scss`)
    .pipe(plumber())
    .pipe(sass({
      includePaths: normalize.includePaths,
      outputStyle: `expanded`
    }))
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(dest(`css`))
    .pipe(csso())
    .pipe(rename(`style.min.css`))
    .pipe(dest(`css`))
}

function serve() {
  watch(`scss/**/*.scss`, styles)
}

function getData(cb) {
  Promise.all([
    fetch(`https://coronavirus.mash.ru/data.json`),
    fetch(`https://coronavirus.mash.ru/`)
  ]).then(async ([data, page]) => {
    const json = await data.json()
    const html = await page.text()
    return [json, html]
  }).then(([json, html]) => {
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
      
    console.log('Done')  

    fs.writeFileSync(`./data/data.json`, JSON.stringify(data), `utf-8`);
  })
  return cb()
}

const build = series(styles)

exports.build = build
exports.start = series(build, serve)
exports.getData = getData
