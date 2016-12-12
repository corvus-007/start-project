var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber =require('gulp-plumber');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var browserSync = require('browser-sync').create();
var mqpacker = require('css-mqpacker');
var minify = require('gulp-csso');
var fileinclude = require('gulp-file-include');
var rename = require('gulp-rename');
var imagemin = require('gulp-imagemin');
var svgstore = require('gulp-svgstore');
var svgmin = require('gulp-svgmin');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var run = require('run-sequence');
var del = require('del');


gulp.task('style', function() {
  return gulp.src('app/scss/style.scss')
    .pipe(plumber({
      errorHandler: function(err) {
        console.log(err);
      }
    }))
    .pipe(sass())
    .pipe(postcss([
      autoprefixer({
        browsers: [
        'last 1 version',
        'last 2 Chrome versions',
        'last 2 Firefox versions',
        'last 2 Opera versions',
        'last 2 Edge versions',
      ]
      }),
      mqpacker({
        sort: true
      })
      ])
    )
    .pipe(gulp.dest('build/'))
    .pipe(minify())
    .pipe(rename({
      suffix: '-min'
    }))
    .pipe(gulp.dest('build/'))
    .pipe(browserSync.stream());
});

gulp.task('plugins-js', function() {
  gulp.src('app/js/plugins/*.js')
    .pipe(concat('plugins.js'))
    .pipe(uglify())
    .pipe(gulp.dest('build/js'))
    .pipe(browserSync.stream());
});

gulp.task('copy-script', function() {
  gulp.src(['app/js/*.{js,json}', '!app/js/plugins/**'])
    .pipe(gulp.dest('build/js'))
    .pipe(browserSync.stream());
});

gulp.task('fileinclude', function() {
  gulp.src('app/*.html')
    .pipe(fileinclude())
    .pipe(gulp.dest('build'));
});

gulp.task('images', function() {
  return gulp.src('build/img/**/*.{png,jpg,gif}')
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true})
    ]))
    .pipe(gulp.dest('build/img'));
});


gulp.task('symbols', function() {
  return gulp.src('build/img/svg-symbols/*.svg')
    .pipe(svgmin())
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename('symbols.svg'))
    .pipe(gulp.dest('build/img'));
});

gulp.task('clean', function() {
  return del('build');
});

gulp.task('copy', function() {
  return gulp.src([
      'app/fonts/**/*.{woff,woff2}',
      'app/img/**',
//      'app/js/**',
      'app/*.html'
    ], {
      base: 'app',
      allowEmpty: true
    })
    .pipe(gulp.dest('build'));
});

gulp.task('build', function(fn) {
  run(
    'clean',
    'copy',
    'style',
    'plugins-js',
    'copy-script',
    'fileinclude',
    'images',
    'symbols',
    fn);
});

gulp.task('serve', function() {
  browserSync.init({
    server: "./build"
  });

  gulp.watch('app/scss/**/*.scss', function() {
    setTimeout(function() {
      gulp.start('style');
    }, 500);
  });
  gulp.watch('app/js/plugins/*.js', ['plugins-js']);
  gulp.watch('app/js/script.js', ['copy-script']);
  gulp.watch(['app/*.html', 'app/blocks/**/*.html'], ['fileinclude']).on('change', browserSync.reload);
});
