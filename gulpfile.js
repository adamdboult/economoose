"use strict";
/*jshint node:true */

// Dependencies
var gulp   = require('gulp'); 
var jshint = require('gulp-jshint');
var sass   = require('gulp-sass');
var exec   = require('child_process').exec;
var del    = require('del');

// JS Hint
gulp.task('jshint', function(cb) {

    gulp.src([__dirname+'/server.js', __dirname+'/gulpfile.js', __dirname+'/config/**/*.js', __dirname+'/src/**/*.js'])
	.pipe(jshint())
	.pipe(jshint.reporter('default'));
    
    cb();
    
});

// Empty folders
gulp.task('emptyDestFolders', function(cb) {

    del.sync([
        __dirname+'/data',
        __dirname+'/public'
    ]);
    
    cb();
    
});

// Favicon
gulp.task('favicon', function(cb) {

    gulp.src(__dirname + '/src/img/compiled/*')
	.pipe(gulp.dest(__dirname+'/public/'));

    cb();
    
});

// Packages
gulp.task('packages', function(cb) {
    
    // Mathjax
    gulp.src(__dirname+'/node_modules/mathjax/es5/**/*')
      .pipe(gulp.dest(__dirname+'/public/packages/mathjax/'));
    
    // Angular
    gulp.src(__dirname+'/node_modules/angular/**/*')
      .pipe(gulp.dest(__dirname+'/public/packages/angular/'));
    
    // Angular-route
    gulp.src(__dirname+'/node_modules/angular-route/**/*')
      .pipe(gulp.dest(__dirname+'/public/packages/angular-route/'));
    
    // D3
    gulp.src(__dirname+'/node_modules/d3/dist/**/*')
      .pipe(gulp.dest(__dirname+'/public/packages/d3/'));
    
    // Bootstrap
    gulp.src(__dirname+'/node_modules/bootstrap/dist/**/*')
      .pipe(gulp.dest(__dirname+'/public/packages/bootstrap/'));
    
    // JQuery
    gulp.src(__dirname+'/node_modules/jquery/dist/**/*')
      .pipe(gulp.dest(__dirname+'/public/packages/jquery/'));
    
    // Popper
    gulp.src(__dirname+'/node_modules/popper.js/dist/umd/**/*')
      .pipe(gulp.dest(__dirname+'/public/packages/popper.js/'));

    cb();
    
});

// Scripts
gulp.task('scripts', function(cb) {
    
    gulp.src(__dirname+'/src/js/**/*')
      .pipe(gulp.dest(__dirname+'/public/js/'));
    
    cb();
    
});

// Styles
gulp.task('styles', function(cb) {

    gulp.src(__dirname+'/src/styles/**/*.scss')
      .pipe(sass())
      .pipe(gulp.dest(__dirname+'/public/css/'));
       
    gulp.src(__dirname+'/src/styles/**/*.css')
       .pipe(gulp.dest(__dirname+'/public/css/'));

    cb();
    
});

// CSV Process
gulp.task('csvProcess', function(cb) {

    exec('./csv-manipulation.py', function(err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });

});

// Exports
exports.default = gulp.series('jshint', 'emptyDestFolders', 'favicon', 'packages', 'scripts', 'styles', 'csvProcess');

