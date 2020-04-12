const {src, dest, watch, series} = require(`gulp`)
const plumber = require(`gulp-plumber`)
const rename = require(`gulp-rename`)

const sass = require(`gulp-sass`)
const postcss = require(`gulp-postcss`)
const autoprefixer = require(`autoprefixer`)
const csso = require(`gulp-csso`)
const normalize = require(`node-normalize-scss`)

const getData = require(`./data`)

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

const build = series(styles)

exports.build = build
exports.start = series(build, serve)
exports.getData = getData
