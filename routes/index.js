var express = require("express");
var router = express.Router();
var vision = require("@google-cloud/vision");
var multer = require("multer");

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index");
});

function getFlowerName(labels) {
  labels = labels || [];
  return labels[Math.floor(Math.random() * labels.length)];
}

/* POST to home page. */
router.post("/", multer().single("flower"), function(req, res, next) {
  var client = new vision.ImageAnnotatorClient();
  var img = req.file.buffer;
  client
    .labelDetection(img)
    .then(results => {
      var labels = results[0].labelAnnotations;
      var isFlower = false;
      labels.forEach(label => {
        var desc = label.description;
        if (desc === "flower" || desc === "flowers") {
          isFlower = true;
          return;
        }
      });
      if (isFlower) {
        res.render("index", {
          imgSrc: img.toString("base64"),
          label: getFlowerName(labels)
        });
      } else {
        res.render("index", {
          imgSrc: img.toString("base64"),
          notFlower: true
        });
      }
    })
    .catch(err => {
      res.render("index");
      console.error("ERROR:", err);
    });
});

module.exports = router;
