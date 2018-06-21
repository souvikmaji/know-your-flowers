const express = require("express");
const router = express.Router();
const multer = require("multer");
const flower = require("../utils/flower.js");

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index");
});

/* POST to home page. */
router.post("/", multer().single("flower"), function(req, res, next) {
  const img = req.file.buffer;
  flower
    .getInfoFromImage(img)
    .then(info => {
      res.render("index", {
        imgSrc: img.toString("base64"),
        label: info.flowerName.toUpperCase(),
        wikiURL: info.wikiContent.wikiURL,
        wikiExtract: info.wikiContent.wikiExtract
      });
    })
    .catch(err => {
      console.log(err);
      res.render("index", {
        imgSrc: img.toString("base64"),
        err: err.message
      });
    });
});

module.exports = router;
