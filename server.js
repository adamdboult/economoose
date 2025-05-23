// Dependencies
var express = require("express");
var fs = require("fs");
var http = require("http");
var mongoose = require("mongoose");

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

console.log("HTTP port is: " + http_port);
console.log("Mongo domain is: " + mongo_domain);
console.log("Mongo port is: " + mongo_port);

///////////
/* Mongo */
///////////
var database_name = "economoose";

var mongo_path =
  "mongodb://" + mongo_domain + ":" + mongo_port + "/" + database_name;
console.log("Mongo path is: " + mongo_path);

mongoose
  .connect(`mongodb://${mongo_domain}:${mongo_port}/${database_name}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

//MODELS
var DataSerie = require(__dirname + "/config/models/data.js");

//FILTER OBJECT
var filterArray = {};
var filterMatchIdentity = "Any";
var filterInit = function () {
  DataSerie.find({}, "filter")
    .then((allobjs) => {
      // Process the results as before, just without the callback
      for (let filter in allobjs) {
        for (let entry in allobjs[filter].filter) {
          if (Object.keys(filterArray).indexOf(entry) === -1) {
            filterArray[entry] = [filterMatchIdentity];
          }
          if (
            filterArray[entry].indexOf(allobjs[filter].filter[entry]) === -1
          ) {
            filterArray[entry].push(allobjs[filter].filter[entry]);
          }
        }
      }
      console.log("Filt: " + filterArray);
    })
    .catch((err) => {
      console.error("Error:", err);
    });
};

//DATA IMPORT
var JSONloc = __dirname + "/data/json/0.json";
var jsonImport = fs.readFileSync(JSONloc, "utf8").toString().split("\n");
//var i,
//  j = 0;
var db = mongoose.connection;
console.log("about to test");
console.log(mongoose.connection.readyState);
console.log("finished test");

db.collection("jsonalls")
  .drop()
  .then(() => {
    // We'll store promises for each valid insert
    const insertPromises = [];

    for (let i = 0; i < jsonImport.length; i++) {
      if (jsonImport[i] === "") {
        console.log("bad: " + i);
        // If you want to handle "empty string" differently,
        // you can just skip it or push a Promise.resolve() here.
        // e.g. insertPromises.push(Promise.resolve());
      } else {
        const jsonObj = JSON.parse(jsonImport[i]);
        // insertOne() returns a Promise if no callback is given
        insertPromises.push(db.collection("jsonalls").insertOne(jsonObj));
      }
    }

    // Wait for all insertOne() calls to finish
    return Promise.all(insertPromises);
  })
  .then(() => {
    // Everything is inserted now
    filterInit();
    favInit();
  })
  .catch((err) => {
    console.error("Error during import:", err);
  });

//FAVOURITE OBJECT
var favouriteObject = {};
var favInit = function () {
  // note this returns an array of all entries listed as favourites. Be it 1, 0 or whatever.
  DataSerie.find({ Favourite: "1" }, "label Favourite")
    .then((favObj) => {
      favouriteObject = favObj;
      console.log("Favs: " + favObj);
    })
    .catch((err) => {
      console.error("Error: " + err);
    });
};

////////////////////////
/* Express and routes */
////////////////////////
var app = express();

app.use(express.static(__dirname + "/public")); // set the static files location /public/img will be /img for users

//pretty makes the html not just 1 line, and so is readable
app.locals.pretty = true;
app.set("views", __dirname + "/src/pug/");
app.set("view engine", "pug");

require(__dirname + "/config/routes/routes")(app);
require(__dirname + "/config/routes/data")(app);

// Other

app.get("/path/:id", function (req, res) {
  res.json(filterArray);
});

app.get("/favs/:id", function (req, res) {
  // note that favouriteObject is an array of all entries listed as favourites. Be it 1, 0 or whatever.
  res.json(favouriteObject);
});

// Since this is the last non-error-handling
// middleware used, we assume 404, as nothing else
// responded.
app.use(function (req, res) {
  res.status(404);

  // respond with html page
  if (req.accepts("html")) {
    res.render("404", { url: req.url });
    return;
  }

  // respond with json
  if (req.accepts("json")) {
    res.send({ error: "Not found" });
    return;
  }

  // default to plain-text. send()
  res.type("txt").send("Not found");
});

/////////////////
/* HTTP server */
/////////////////
var httpServer = http.createServer(app);
var HTTPport = http_port;
httpServer.listen(HTTPport);

console.log("App listening on port " + http_port);
