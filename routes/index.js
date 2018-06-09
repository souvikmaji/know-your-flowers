var express = require("express");
var router = express.Router();
var vision = require("@google-cloud/vision");
var multer = require("multer");

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

/* POST to home page. */
router.post("/", multer().single("flower"), function(req, res, next) {
  var client = new vision.ImageAnnotatorClient();
  var img = req.file.buffer;
  client
    .labelDetection(img)
    .then(results => {
      var labels = results[0].labelAnnotations;
      res.render("index", {
        title: "express",
        imgSrc: img.toString("base64"),
        labels: labels
      });
    })
    .catch(err => {
      res.render("index", { title: "Express" });
      console.error("ERROR:", err);
    });
});

module.exports = router;
