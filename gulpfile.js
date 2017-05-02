var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var bump = require('gulp-bump');
var args = require('yargs').argv;
var fs = require('fs');
var replace = require('gulp-replace');
var merge = require('merge-stream');
var serve = require('gulp-serve');
var browserSync = require('browser-sync');
var runSequence = require('run-sequence');

var preprocess = require('gulp-preprocess');

var paths = {
  sass: ['./scss/**/*.scss'],
  const: ['./templates/constants.js']
};

var src = {
  sass: ['./scss/**/*.scss'],
  js: ['www/js/**/*.js'],
  templates: ['www/templates/**/*.html']
};

var dest = {
  css: './www/css/',
  js: './www/js/'
};

gulp.task('default', ['constants', 'sass']);

gulp.task('serve:before', ['watch']);

gulp.task('constants', function() {
  gulp.src('./templates/constants.js')
      .pipe(preprocess({ context: { ENV: process.env.NODE_ENV || 'development', DEBUG: true } }))
      .pipe(gulp.dest(dest.js));
});

gulp.task('sass', function(done) {
  gulp.src('./scss/*.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest(dest.css))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest(dest.css))
    .on('end', done);
});

gulp.task('watch', function() {
  var logChange = function(file){
    gutil.log("File changed ", gutil.colors.magenta(file.path));
  };

  gulp.watch(src.js, function(file){
    gutil.log(file);
    logChange(file);
    browserSync.reload();
  });

  gulp.watch(src.sass, function(file){
    logChange(file);
    runSequence(['sass']);
  });

  gulp.watch(src.templates, function(file){
    logChange(file);
    browserSync.reload();
  });

  gulp.watch(paths.const, ['constants']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('increment-version', function(){

  var docString = fs.readFileSync('./templates/constants.js', 'utf8');

  var oldVersionNumber = docString.match(/v(\d+(\.\d)*)/i)[1];
  var date = docString.match(/_(\d+(\.\d)*)/i)[1];
  var time = docString.match(/([01]?[0-9]|2[0-3]):[0-5][0-9]/)[0];
  console.log('Current version: ' + oldVersionNumber);
  console.log('Current date: ' + date);
  console.log('Current time: '+ time);
  var versionParts = JSON.parse(oldVersionNumber);
  var newVersionNumber = versionParts + 0.1;
  var fixedVersionNumber = newVersionNumber.toFixed(1);
  var today = new Date();
  var newDateString = today.toISOString().substring(0, 10);
  var newDate = newDateString.split('-').join('');
  var currentTime = today.toTimeString();
  currentTime = currentTime.split(' ')[0].split(':');
  currentTime.pop();
  var newTime = currentTime.join(':');
  var firstPath = gulp.src(['./templates/constants.js'])
    .pipe(replace(oldVersionNumber, fixedVersionNumber))
    .pipe(replace(date, newDate))
    .pipe(replace(time, newTime))
    .pipe(gulp.dest('./templates'));
  var secondPath = gulp.src(['./www/js/constants.js'])
    .pipe(replace(oldVersionNumber, fixedVersionNumber))
    .pipe(replace(date, newDate))
    .pipe(replace(time, newTime))
    .pipe(gulp.dest('./www/js'));
  return merge(firstPath, secondPath);

});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

gulp.task('serve', ['sass', 'serve-www', 'browser-sync', 'watch']);

gulp.task('serve-www', serve({
  root: "./www",
  port: 3000
}));

gulp.task('browser-sync', function() {
  browserSync({
    reloadOnRestart: true,
    files: ['www/**/*.css'],
    proxy: {
      target: "http://localhost:3000",
      ws: true
    }
  });
});
