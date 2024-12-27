module.exports = function (app) {
  app.get("/", function (req, res) {
    res.render("home");
  });

  app.get("/about", function (req, res) {
    res.render("about");
  });
};
