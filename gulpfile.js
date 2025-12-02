const { src, dest, watch, series, parallel } = require('gulp');
const fileinclude = require('gulp-file-include');
const sass = require('gulp-sass')(require('sass'));
const cssnano = require('gulp-cssnano');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();

// Configuration for each site
const sites = {
  web1: {
    root: 'web1',
    dist: 'dist/web1'
  },
  web2: {
    root: 'web2',
    dist: 'dist/web2'
  }
};

function createSiteTasks(siteName, config) {
  const srcRoot = `${config.root}/app`;
  const distRoot = config.dist;

  const paths = {
    html: {
      src: `${srcRoot}/index.html`,
      watch: `${srcRoot}/**/*.html`,
      dest: `${distRoot}/`
    },
    styles: {
      src: `${srcRoot}/scss/**/*.scss`,
      dest: `${distRoot}/css/`
    },
    scripts: {
      src: `${srcRoot}/js/**/*.js`,
      dest: `${distRoot}/js/`
    },
    images: {
      src: `${srcRoot}/img/**/*`,
      dest: `${distRoot}/img/`
    }
  };

  function htmlTask() {
    return src(paths.html.src)
      .pipe(fileinclude({
        prefix: '@@',
        basepath: '@file'
      }))
      .pipe(dest(paths.html.dest))
      .pipe(browserSync.stream());
  }

  function scssTask() {
    return src(paths.styles.src)
      .pipe(sass().on('error', sass.logError))
      .pipe(dest(paths.styles.dest))
      .pipe(cssnano())
      .pipe(rename({ suffix: '.min' }))
      .pipe(dest(paths.styles.dest))
      .pipe(browserSync.stream());
  }

  function jsTask() {
    return src(paths.scripts.src, { sourcemaps: true })
      .pipe(concat('main.js'))
      .pipe(dest(paths.scripts.dest))
      .pipe(uglify())
      .pipe(rename({ suffix: '.min' }))
      .pipe(dest(paths.scripts.dest))
      .pipe(browserSync.stream());
  }

  function imgTask() {
    return src(paths.images.src)
      .pipe(imagemin())
      .pipe(dest(paths.images.dest));
  }

  function watchTask() {
    watch(paths.html.watch, htmlTask);
    watch(paths.styles.src, scssTask);
    watch(paths.scripts.src, jsTask);
    watch(paths.images.src, imgTask);
  }

  const build = parallel(htmlTask, scssTask, jsTask, imgTask);

  return {
    paths,
    htmlTask,
    scssTask,
    jsTask,
    imgTask,
    watchTask,
    build
  };
}

// Create tasks per site
const siteTasks = {};
Object.keys(sites).forEach((site) => {
  siteTasks[site] = createSiteTasks(site, sites[site]);
});

// Bootstrap copy tasks
function bootstrapCss() {
  return src('node_modules/bootstrap/dist/css/bootstrap.min.css')
    .pipe(dest('dist/web1/css'))
    .pipe(dest('dist/web2/css'));
}

function bootstrapJs() {
  return src('node_modules/bootstrap/dist/js/bootstrap.bundle.min.js')
    .pipe(dest('dist/web1/js'))
    .pipe(dest('dist/web2/js'));
}

// Build tasks
const buildWeb1 = series(siteTasks.web1.build, parallel(bootstrapCss, bootstrapJs));
const buildWeb2 = series(siteTasks.web2.build, parallel(bootstrapCss, bootstrapJs));
const buildAll = series(
  parallel(siteTasks.web1.build, siteTasks.web2.build),
  parallel(bootstrapCss, bootstrapJs)
);

// Serve helpers
function serveFactory(site) {
  return function serve() {
    const config = sites[site];

    browserSync.init({
      server: { baseDir: config.dist },
      port: site === 'web2' ? 3001 : 3000
    });

    siteTasks[site].watchTask();
  };
}

const serveWeb1 = series(buildWeb1, serveFactory('web1'));
const serveWeb2 = series(buildWeb2, serveFactory('web2'));

// Exports
exports['bootstrap:css'] = bootstrapCss;
exports['bootstrap:js'] = bootstrapJs;

exports['build:web1'] = buildWeb1;
exports['build:web2'] = buildWeb2;
exports.build = buildAll;

exports['serve:web1'] = serveWeb1;
exports['serve:web2'] = serveWeb2;
exports.default = serveWeb2;


