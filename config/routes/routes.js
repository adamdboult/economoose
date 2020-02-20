//var express=require('express');
var fs=require('fs');
//var https=require('https');
//var parseString = require('xml2js').parseString;
var modelArray=[];
var blogArray=[];
var rssString='<?xml version="1.0" encoding="UTF-8" ?>';
rssString   +='<rss version ="2.0">';
rssString   +='<channel>';
rssString   +='<title>YetiPredict</title>';
rssString   +='<link>http://www.economoose.com</link>';
rssString   +='<description>RSS feed for Economoose</description>';

rssString   +='<image>';
rssString   +='<url>http://www.economoose.com/img/economoose.ico</url>';
rssString   +='<link>http://www.economoose.com</link>';
rssString   +='</image>';
var postTitle;
var postDate;
var postNoType;
var postFull;

module.exports = function(app, logger){
    'use strict';
    //var DataSerie=require(__dirname+'/../models/data.js');
    //var rootObject={root:__dirname+'/../../public'};
    
    // STATIC
    app.get('/', function(req, res) {
	//res.redirect('/predict');
	res.render('home');
    });
/*
    app.get('/news', function(req,res){
	res.render('blog',{posts:blogArray});
    });

    app.get('/theory', function(req,res){
	res.render('theory');
    });


    app.get('/models', function(req,res){
	res.render('models',{models:modelArray});
    });

    app.get('/rss', function(req,res){
	res.set('Content-Type', 'application/rss+xml');
	res.send(rssString);
    });
*/
    app.get('/about', function(req, res){
	res.render('about');
    });

    // DYNAMIC
/*
    app.get('/theory/:area', function(req,res){
	res.render('theory/'+req.params.area, {}, function(err, html) {
	    if(err) {
		res.render('404', { url: req.url });
	    } else {
		res.send(html);
	    }
	});
    });
    
    app.get('/theory/:area/:subject', function(req,res){
	res.render('theory/'+req.params.area+'/'+req.params.subject, {}, function(err, html) {
	    if(err) {
		res.render('404', { url: req.url });
	    } else {
		res.send(html);
	    }
	});
    });
    
    app.get('/theory/:area/:subject/:subsubject', function(req,res){
	res.render('theory/'+req.params.area+'/'+req.params.subject+'/'+req.params.subsubject, {}, function(err, html) {
	    if(err) {
		res.render('404', { url: req.url });
	    } else {
		res.send(html);
	    }
	});
    });

    app.get('/news/:post', function(req,res){
	res.render('blog/'+req.params.post, {}, function(err, html) {
	    if(err) {
		res.render('404', { url: req.url });
	    } else {
		res.send(html);
	    }
	});
    });

    app.get('/models/:post', function(req,res){
	res.render('models/'+req.params.post, {}, function(err, html) {
	    if(err) {
		res.render('404', { url: req.url });
	    } else {
		res.send(html);
	    }
	});
    });
*/
};

