var express = require("express");
var router = express.Router();
var vision = require("@google-cloud/vision");
var multer = require("multer");
var request = require("request");

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index");
});

function getFlowerName(labels) {
  labels = labels || [];
  const index = Math.floor(Math.random() * labels.length);
  return labels[index];
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
        const flowerName = getFlowerName(labels).description;
        request.get(
          "https://en.wikipedia.org/api/rest_v1/page/summary/" + flowerName,
          (err, response, body) => {
            if (err) {
              throw err;
            } else {
              body = JSON.parse(body);
              if (body.type.includes("errors")) {
                res.render("index", {
                  imgSrc: img.toString("base64"),
                  label:
                    "Error occured while identifying flower. Please try again after some time"
                });
              } else {
                res.render("index", {
                  imgSrc: img.toString("base64"),
                  label: flowerName,
                  wikiURL: body.content_urls.desktop.page,
                  wikiExtract: body.extract
                });
              }
            }
          }
        );
      } else {
        res.render("index", {
          imgSrc: img.toString("base64")
        });
      }
    })
    .catch(err => {
      res.render("index");
      console.error("ERROR:", err);
    });
});

module.exports = router;
