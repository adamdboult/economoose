module.exports = function (app) {
  var DataSerie = require(__dirname + "/../models/data.js");
  //var rootObject = { root: __dirname + "/../../public" };

  app.get("/dpi/:id", function (req, res) {
    /*DataSerie.find({ _id: req.params.id }, function (err, idw) {
      if (err) {
        console.error("doh");
        res.send(err);
      }
      res.json(idw);
    });*/
    DataSerie.find({ _id: req.params.id })
      .then((idw) => {
        res.json(idw);
      })
      .catch((err) => {
        console.error("doh");
        res.send(err);
      });
  });
  var filterMatchIdentity = "Any";
  app.get("/cpi/:id", function (req, res) {
    var reqObj = JSON.parse(req.params.id);
    var pagenum = reqObj.pageCount - 1;
    delete reqObj.pageCount;
    var query = {};
    for (var x in reqObj) {
      if (reqObj[x] === filterMatchIdentity) {
        query["filter." + x] = { $exists: true };
      } else {
        query["filter." + x] = reqObj[x];
      }
    }
    var pagelen = 20;
    //for (var ftrs in query) {
    //}

    /*DataSerie.count(query, function (err1, edw1) {
      DataSerie.find(
        query,
        "uniqueID label filter",
        { skip: pagenum * pagelen, limit: pagelen },
        function (err, idw) {
          if (err) {
            res.send(err);
          }
          var pagesArray = [Math.ceil(edw1 / pagelen), 1];
          var pages = Math.max.apply(Math, pagesArray);
          idw.push(pages);
          res.json(idw);
        },
      );
    });*/
    // Using nested .then():
    DataSerie.countDocuments(query)
      .then((edw1) => {
        // Once we have the count (edw1), do the find() query
        return DataSerie.find(query, "uniqueID label filter", {
          skip: pagenum * pagelen,
          limit: pagelen,
        }).then((idw) => {
          const pagesArray = [Math.ceil(edw1 / pagelen), 1];
          const pages = Math.max(...pagesArray);
          idw.push(pages);
          res.json(idw);
        });
      })
      .catch((err) => {
        res.send(err);
      });
  });
};
