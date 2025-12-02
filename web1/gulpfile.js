const { src, dest, watch, series, parallel } = require('gulp');
const fileinclude = require('gulp-file-include');
const sass = require('gulp-sass')(require('sass'));
const cssnano = require('gulp-cssnano');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();

// Paths
const paths = {
  html: {
    src: 'app/index.html',
    watch: 'app/**/*.html',
    dest: 'dist/'
  },
  styles: {
    src: 'app/scss/**/*.scss',
    dest: 'dist/css/'
  },
  scripts: {
    src: 'app/js/**/*.js',
    dest: 'dist/js/'
  },
  images: {
    src: 'app/img/**/*',
    dest: 'dist/img/'
  }
};

// HTML task (supports file includes)
function htmlTask() {
  return src(paths.html.src)
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(dest(paths.html.dest))
    .pipe(browserSync.stream());
}

// SCSS -> CSS, minify, rename
function scssTask() {
  return src(paths.styles.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(dest(paths.styles.dest))
    .pipe(cssnano())
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(paths.styles.dest))
    .pipe(browserSync.stream());
}

// JS: concat + minify
function jsTask() {
  return src(paths.scripts.src, { sourcemaps: true })
    .pipe(concat('main.js'))
    .pipe(dest(paths.scripts.dest))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(paths.scripts.dest))
    .pipe(browserSync.stream());
}

// Images optimization
function imgTask() {
  return src(paths.images.src)
    .pipe(imagemin())
    .pipe(dest(paths.images.dest));
}

// Serve + watch
function serveTask() {
  browserSync.init({
    server: { baseDir: 'dist' },
    port: 3000
  });

  watch(paths.html.watch, htmlTask);
  watch(paths.styles.src, scssTask);
  watch(paths.scripts.src, jsTask);
  watch(paths.images.src, imgTask);
}

// Build task
const build = series(parallel(htmlTask, scssTask, jsTask, imgTask));

// Default task: build -> serve
exports.build = build;
exports.default = series(build, serveTask);

// Individual exports (optional)
exports.html = htmlTask;
exports.scss = scssTask;
exports.js = jsTask;
exports.images = imgTask;
