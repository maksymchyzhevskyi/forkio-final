// ---------imports--------

const { src, dest, watch, parallel, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync');
const clean = require('gulp-clean');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const minifyJs = require('gulp-js-minify');

//--------functions--------

function styles() {
    return src('./src/scss/**/*.scss')
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(concat('style.min.css'))
        .pipe(browserSync.stream())
        .pipe(cleanCSS())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 3 versions'],
            grid: true,
            cascade: true
        }))
        .pipe(dest('./dist/css'));
}

function scripts() {
    return src('./src/js/app.js')
        .pipe(concat('app.min.js'))
        .pipe(uglify())
        .pipe(dest('./dist/js'))
        .pipe(browserSync.stream());
}

function imageMin() {
    return src('./src/img/**/*.*')
        .pipe(imagemin())
        .pipe(dest('./dist/img'))
}

function watching() {
    watch(['./src/scss/**/*.scss'], styles);
    watch(['./src/js/app.js'], scripts);
    watch('./src/img/**/*.*', imageMin);
    watch('/index.html').on('change', browserSync.reload);
}


function copyProject() {
    return src('./src/**/*.*')
        .pipe(concat('./dist'))
        .pipe(dest('./dist'))
}

function deleteDist() {
    return src('./dist/', { read: false, allowEmpty: true })
        .pipe(clean())
}

function deleteSCSS() {
    return src('./dist/scss', { read: false, allowEmpty: true })
        .pipe(clean())
}

function reloadPage() {
    browserSync.init({
        server: {
            baseDir: './',
            port: 3000,
            keepalive: true
        }
    })
}

//---------exports--------

exports.styles = styles;
exports.scripts = scripts;
exports.watching = watching;
exports.imageMin = imageMin;
exports.copyProject = copyProject;
exports.deleteDist = deleteDist;
exports.deleteSCSS = deleteSCSS;
exports.reloadPage = reloadPage;

exports.default = parallel(watching, reloadPage);

exports.dev = series(watching, deleteDist, copyProject, reloadPage);
exports.build = series(deleteDist, styles, deleteSCSS, scripts, copyProject, imageMin);
