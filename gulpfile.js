var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyHTML = require('gulp-minify-html');
    concat = require('gulp-concat');

var env = process.env.NODE_ENV || 'development';

var outputDir, sassStyle;

if(env==='development'){
  outputDir = 'builds/development/';
  sassStyle = 'expanded';
}else{
  outputDir = 'builds/production/';
  sassStyle = 'compressed';
}

var coffeeSources = ['components/coffee/*.coffee'];
var jsSources = [
  'components/scripts/rclick.js',
  'components/scripts/pixgrid.js',
  'components/scripts/tagline.js',
  'components/scripts/template.js'
]

var sassSources = [
  'components/sass/style.scss'
]

var htmlSources = [
  outputDir + '*.html'
]

gulp.task('coffee', function() {
  gulp.src(coffeeSources)
    .pipe(coffee({bare:true})
      .on('error', gutil.log))
    .pipe(gulp.dest('components/scripts'))
})

gulp.task('js', function() {
  gulp.src(jsSources)
    .pipe(concat('script.js'))
    .pipe(browserify())
    .pipe(gulpif(env==='production', uglify()))
    .pipe(gulp.dest(outputDir + 'js'))
    .pipe(connect.reload())
})

gulp.task('compass', function() {
  gulp.src(sassSources)
    .pipe(compass({
      sass: 'components/sass',
      images: outputDir + 'images',
      style: sassStyle
    })
      .on('error', gutil.log))
    .pipe(gulp.dest(outputDir + 'css'))
    .pipe(connect.reload())
})

gulp.task('watch', function () {
  gulp.watch('coffeeSources', ['coffee']);
  gulp.watch('jsSources', ['js']);
  gulp.watch('builds/development/*.html', ['html']);
})

gulp.task('connect', function () {
  connect.server({
    root: outputDir,
    livereload: true
  });
})

gulp.task('html', function () {
  gulp.src('builds/development/*.html')
  .pipe(gulpif(env==='production', minifyHTML()))
  .pipe(gulpif(env==='production', gulp.dest(outputDir)))
  .pipe(connect.reload())
})

gulp.task('default', ['html', 'coffee', 'js', 'compass', 'connect', 'watch']);
