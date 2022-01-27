"use strict";
/*jshint node:true */

// Dependencies
var express  = require('express');
var fs       = require('fs');
var http     = require('http');
var mongoose = require('mongoose');

////////////////////////////////////
/* Process command line arguments */
////////////////////////////////////

var http_port = 8080;
if (process.argv[2] != null) {
    http_port = process.argv[2];
}

var mongo_domain = "127.0.0.1";
if (process.argv[3] != null) {
    mongo_domain = process.argv[3];
}

var mongo_port = 27017;
if (process.argv[4] != null) {
    mongo_port = process.argv[4];
}

console.log("HTTP port is: "   + http_port);
console.log("Mongo domain is: "+ mongo_domain);
console.log("Mongo port is: "  + mongo_port);

///////////
/* Mongo */
///////////
var database_name = "economoose";

var mongo_path = 'mongodb://' + mongo_domain + ':' + mongo_port + '/' + database_name;
console.log("Mongo path is: " + mongo_path);
mongoose.connect(mongo_path, { useNewUrlParser: true, useUnifiedTopology: true}, function(err) {
    if (err) console.error("ERR" + err);
});

/*
if (console.log(process.argv[2]) === "docker") {
    mongoose.connect('mongodb://economoose_mongo:27018/' + configObj.databaseName, { useNewUrlParser: true, useUnifiedTopology: true}, function(err) {
        if (err) console.error("ERR" + err);
    });
}
else {
    mongoose.connect('mongodb://127.0.0.1:27017/' + configObj.databaseName, { useNewUrlParser: true, useUnifiedTopology: true}, function(err) {
        if (err) console.error("ERR" + err);
    });
}
*/

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
	console.log("Filt: " + filterArray);	
    });
};

//DATA IMPORT
var JSONloc = __dirname + '/data/json/0.json';
var jsonImport = fs.readFileSync(JSONloc, 'utf8').toString().split('\n');
var i, j = 0;
var db = mongoose.connection;
console.log("about to test");
console.log(mongoose.connection.readyState);
console.log("finished test");
db.collection('jsonalls').drop();
var jsonObj;
var addToMongoCallback = function(jsonObj) {

    //db.collection('jsonalls').save(jsonObj, function() {
    db.collection('jsonalls').insertOne(jsonObj, function() {
	j = j + 1;
	if (j === jsonImport.length) {
	    filterInit();
	    favInit();
	}
    });
};

for (i = 0; i < jsonImport.length; i++) {
    //console.log("hi7");
    if (jsonImport[i] === "") {
	console.log("bad: " + i);
	j = j + 1;
	if (j === jsonImport.length) {
	    filterInit();
	}
    }
    else {
	jsonObj = JSON.parse(jsonImport[i]);
	addToMongoCallback(jsonObj);
    }
    //console.log("hi8");
    if (jsonImport.length === i + 1) {
    }
}



//FAVOURITE OBJECT
var favouriteObject = {};
var favInit = function() {
    DataSerie.find({"Favourite": "1"}, 'label Favourite', function(err, favObj) {
	if (err){
	    console.error("Error: " + err);
	}
	favouriteObject= favObj;
	console.log("Favs: " + favObj);
    });
};

////////////////////////
/* Express and routes */
////////////////////////
var app = express();

app.use(express.static(__dirname + '/public'));// set the static files location /public/img will be /img for users

//app.locals.pretty=true;
app.set('views',__dirname+'/src/pug/');
app.set('view engine', 'pug');

require(__dirname+'/config/routes/routes')(app);
require(__dirname+'/config/routes/data')(app);

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



/////////////////
/* HTTP server */
/////////////////
var httpServer=http.createServer(app);
var HTTPport = process.env.PORT || http_port;
httpServer.listen(HTTPport);

console.log("App listening on port " + http_port);

