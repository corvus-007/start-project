let gulp = require('gulp');
let sass = require('gulp-sass');
let plumber =require('gulp-plumber');
let postcss = require('gulp-postcss');
let autoprefixer = require('autoprefixer');
let server = require('browser-sync');
let mqpacker = require('css-mqpacker');
let minify = require('gulp-csso');
let fileinclude = require('gulp-file-include');
let rename = require('gulp-rename');
let imagemin = require('gulp-imagemin');
let svgstore = require('gulp-svgstore');
let svgmin = require('gulp-svgmin');
let run = require('run-sequence');
let del = require('del');


gulp.task('style', () => {
  gulp.src('app/scss/style.scss')
    .pipe(plumber())
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
    .pipe(gulp.dest('build/css'))
    .pipe(minify())
    .pipe(rename({
      suffix: '-min'
    }))
    .pipe(gulp.dest('build/css'))
    .pipe(server.reload({stream: true}));
});

gulp.task('script', () => {
  gulp.src('app/js/**/*.js')
    .pipe(gulp.dest('build/js'))
    .pipe(server.reload({stream: true}));
});

gulp.task('fileinclude', () => {
  gulp.src('app/*.html')
    .pipe(fileinclude())
    .pipe(gulp.dest('build'));
});

// gulp.task('copy-html', () => {
//   gulp.src('app/*.html')
//     .pipe(gulp.dest('build'));
// });

gulp.task('images', () => {
  return gulp.src('build/img/**/*.{png, jpg, gif}')
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true})
    ]))
    .pipe(gulp.dest('build/img'));
});


gulp.task('symbols', () => {
  return gulp.src('build/img/svg-symbols/*.svg')
    .pipe(svgmin())
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename('symbols.svg'))
    .pipe(gulp.dest('build/img'));
});


gulp.task('serve', () => {
  server.init({
    server: "build"
  });

  gulp.watch('app/scss/**/*.scss', ['scss']);
  // gulp.watch('app/js/**/*.js', ['js']);
  gulp.watch(['app/*.html', 'app/blocks/**/*.html'], ['fileinclude']).on('change', server.reload);
});

gulp.task('clean', () => {
  return del('build');
});

gulp.task('copy', () => {
  return gulp.src([
      'app/fonts/**/*.{woff, woff2}',
      'app/img/**',
      'app/js/**',
      'app/*.html'
    ], {
      base: 'app',
      allowEmpty: true
    })
    .pipe(gulp.dest('build'));
});

gulp.task('build', (fn) => {
  run(
    'clean',
    'copy',
    'style',
    'fileinclude',
    'images',
    'symbols',
    fn);
});
