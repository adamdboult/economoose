"use strict";
/*jshint node:true */

//////////////////
/* Dependencies */
//////////////////

//WINSTON
var logger = require(__dirname + '/config/winston');

//DEPENDENCIES, 'jade' not included but referenced later
var express  = require('express'),
    mongoose = require('mongoose'),
    fs       = require('fs'),
    http     = require('http'),
    favicon  = require('serve-favicon')

////////////
/* config */
////////////
var configObj = JSON.parse(fs.readFileSync(__dirname + '/config.json' , 'utf8'));


/////////////
/* Express */
/////////////

//START EXPRESS
var app = express();

//FAVICON
app.use(favicon(__dirname + configObj.favicon));


///////////
/* MONGO */
///////////
//CONNECT TO MONGODB
//mongoose.connect('mongodb://localhost/' + configObj.databaseName, function(err) {

// NB: latter is for docker
//mongoose.connect('mongodb://127.0.0.1:27017/' + configObj.databaseName, function(err) {
mongoose.connect('mongodb://mongo:27018/' + configObj.databaseName, function(err) {
    if (err) logger.debug("ERR" + err);
});
console.log("here?");



//MODELS
var DataSerie = require(__dirname + '/config/models/data.js');

//FILTER OBJECT
var filterArray = {};
var filterMatchIdentity = "Any";
var filterInit=function() {
    DataSerie.find({}, 'filter', function(err, allobjs) {
	if (err){
	    //		logger.debug("Error: "+err);
	}

	for (var filter in allobjs) {
	    for (var entry in allobjs[filter].filter) {
		if (Object.keys(filterArray).indexOf(entry) === -1) {
		    filterArray[entry] = [filterMatchIdentity];
		}
		if (filterArray[entry].indexOf(allobjs[filter].filter[entry]) === -1) {
		    filterArray[entry].push(allobjs[filter].filter[entry]);
		}
	    }
	}
	logger.debug("Filt: " + filterArray);	
    });
};

//DATA IMPORT
var JSONloc = __dirname + '/data/json/0.json';
var jsonImport = fs.readFileSync(JSONloc, 'utf8').toString().split('\n');
var i, j = 0;
var db = mongoose.connection;
db.collection('jsonalls').drop();
var jsonObj;
var addToMongoCallback = function(jsonObj) {

    db.collection('jsonalls').save(jsonObj, function() {
	j = j + 1;
	if (j === jsonImport.length) {
	    filterInit();
	    favInit();
	}
    });
};

for (i = 0; i < jsonImport.length; i++) {	
    if (jsonImport[i] === "") {
	logger.debug("bad: " + i);
	j = j + 1;
	if (j === jsonImport.length) {
	    filterInit();
	}
    }
    else {
	jsonObj = JSON.parse(jsonImport[i]);
	addToMongoCallback(jsonObj);
    }

    if (jsonImport.length === i + 1) {
    }
}



//FAVOURITE OBJECT
var favouriteObject = {};
var favInit = function() {
    DataSerie.find({"Favourite": "1"}, 'label Favourite', function(err, favObj) {
	if (err){
	    logger.debug("Error: " + err);
	}
	favouriteObject= favObj;
	logger.debug("Favs: " + favObj);
    });
};

////////////
/* ROUTES */
////////////
app.use(express.static(__dirname + '/public'));// set the static files location /public/img will be /img for users

app.locals.pretty=true;
app.set('views',__dirname+'/src/jade/');
app.set('view engine', 'jade');

require(__dirname+'/config/routes/routes')(app, logger);
require(__dirname+'/config/routes/data')(app, logger);

// Other?
/*
app.get('/sitemap.xml', function(req, res){
    sitemap.toXML(function(xml){
	res.header('Content-Type', 'application/xml');
	res.send(xml);
    });
});
*/

// Other?

var robotSend = "";
var robotSendArray = [
    "User-agent: *",
    "Sitemap: /sitemap.xml"
];
var robotSendArrayEntry;
for (robotSendArrayEntry in robotSendArray){
    robotSend+="\n"+robotSendArray[robotSendArrayEntry];
}

app.get('/robots.txt', function(req,res){
    res.type('text/plain');
    //    res.send("User-agent: *\nSitemap: /sitemap.xml");
    res.send(robotSend);
});

// Other

app.get('/path/:id', function(req, res) {
    res.json(filterArray);
});

app.get('/favs/:id', function(req, res) {
    res.json(favouriteObject);
});

// Since this is the last non-error-handling
// middleware used, we assume 404, as nothing else
// responded.
app.use(function(req, res, next){
    res.status(404);

    // respond with html page
    if (req.accepts('html')) {
	res.render('404', { url: req.url });
	return;
    }

    // respond with json
    if (req.accepts('json')) {
	res.send({ error: 'Not found' });
	return;
    }
    
    // default to plain-text. send()
    res.type('txt').send('Not found');
});

//////////
/* HTTP */
//////////
var HTTPportnum=configObj.ports.http;
var HTTPport = process.env.PORT || HTTPportnum;

var httpServer=http.createServer(app);
httpServer.listen(HTTPport);

logger.debug("App listening on port " + HTTPport);

