var express = require("express");
var router = express.Router();
var vision = require("@google-cloud/vision");

/* GET home page. */
router
  .get("/", function(req, res, next) {
    res.render("index", { title: "Express" });
  })
  .post("/", function(req, res, next) {
    var client = new vision.ImageAnnotatorClient();
    var img = req.file.buffer;
    client
      .labelDetection(img)
      .then(results => {
        res.render("index", {
          title: "express",
          imgSrc: img.toString("base64"),
          labels: results[0].labelAnnotations
        });
      })
      .catch(err => {
        res.render("index", { title: "Express" });
        console.error("ERROR:", err);
      });
  });

module.exports = router;
