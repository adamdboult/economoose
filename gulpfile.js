"use strict";
/*jshint node:true */

//////////////////
/* DEPENDENCIES */
//////////////////
// include gulp
var gulp = require('gulp'); 

// include plug-ins
var jshint = require('gulp-jshint');
//var changed = require('gulp-changed');
//var minifyHTML = require('gulp-minify-html');
var concat = require('gulp-concat');
var stripDebug = require('gulp-strip-debug');
var uglify = require('gulp-uglify');
var autoprefix = require('gulp-autoprefixer');
//var minifyCSS = require('gulp-minify-css');
var sass = require('gulp-sass');
var rmdir = require('rimraf');
var fs = require('fs');
var shell = require('gulp-shell');
var Q = require('q');

/////////////////
/* DIRECTORIES */
/////////////////

var jsConcatFilesData = [__dirname+'/src/scripts/coreData.js'];

var jshintFiles = [
    __dirname+'/server.js',
    __dirname+'/gulpfile.js',
    __dirname+'/config/routes/data.js',
    __dirname+'/src/scripts/coreData.js',
];
var stylesFiles = [
    //bowerDir+'/bootstrap/dist/css/bootstrap.css',
    //bowerDir+'/Bootflat/bootflat/css/bootflat.min.css',
    //bowerDir+'/bootstrap-theme-bootswatch-flatly/css/bootstrap.min.css',
    //bowerDir+'/bootstrap-material-design/dist/css/roboto.min.css',
    //bowerDir+'/bootstrap-material-design/dist/css/material.min.css',
    //bowerDir+'/bootstrap-material-design/dist/css/ripples.min.css',
    //bowerDir+'/flat-ui/dist/css/flat-ui.min.css',
    __dirname+'/src/styles/core.scss'
];

gulp.task('clean', function() {
    var deferred = Q.defer();
    rmdir(__dirname+'/public', function(error){
	rmdir(__dirname+'/data', function(error){
	    fs.mkdirSync(__dirname+'/public');
	    fs.mkdirSync(__dirname+'/data');
	    deferred.resolve();
	});
    });
    return deferred.promise;
});


gulp.task('datepicker',['clean'],function() {
    gulp.src(datepickerFolder,{base:bowerDir+'/bootstrap-datepicker/js'})
	.pipe(gulp.dest(__dirname+'/public/js/datepicker/'));
});

// JS hint task
gulp.task('jshint', ['clean'], function() {
    gulp.src(jshintFiles)
	.pipe(jshint())
	.pipe(jshint.reporter('default'));
});

// JS concat, strip debugging and minify
gulp.task('scripts', ['clean'], function() {
    gulp.src(jsConcatFilesData)
	.pipe(concat('coreData.js'))
	.pipe(stripDebug())
	.pipe(uglify())
	.pipe(gulp.dest(__dirname+'/public/js/'));
});

gulp.task('scripts-debug', ['clean'], function() {
    gulp.src(jsConcatFilesData)
	.pipe(concat('coreData.js'))
	.pipe(gulp.dest(__dirname+'/public/js/'));
});


gulp.task('styles', ['clean'], function() {
    gulp.src(stylesFiles)
	.pipe(concat('styles.scss'))
        .pipe(sass())
	.pipe(autoprefix('last 2 versions'))
	//.pipe(minifyCSS({keepSpecialComments:false}))
    //	.pipe(stripDebug())
	.pipe(gulp.dest(__dirname+'/public/css/'));
});
// minify new images
gulp.task('imagemin', ['clean'], function() {
    var imgSrc = __dirname+'/src/img/compiled/*',
	imgDst = __dirname+'/public/img';
    
    gulp.src(imgSrc)
	.pipe(gulp.dest(imgDst));
});

// jade
gulp.task('jade', ['clean'], function() {
    var YOUR_LOCALS = {};

});


gulp.task('csvProcess',['clean'], shell.task([
    './csv-manipulation.py'
]));

gulp.task('nonScript', ['styles', 'jade', 'imagemin', 'csvProcess'], function(){
});
//gulp.task('nonScript',['styles','jade','imagemin','fonts','csvProcess','mathjax','datepicker','fallbackjs'], function(){
//});

gulp.task('debug', ['nonScript', 'scripts-debug', 'jshint'], function(){
});

gulp.task('default', ['nonScript', 'scripts'], function(){
});

