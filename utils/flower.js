const vision = require("@google-cloud/vision");
const request = require("request");

const isFlower = function(labels) {
  for (label of labels) {
    if (label.description === "flower" || label.description === "flowers") {
      return true;
    }
  }
  return false;
};

const getName = function(labels) {
  labels = labels || [];
  if (isFlower(labels)) {
    const flowerIndex = Math.floor(Math.random() * labels.length);
    return labels[flowerIndex].description;
  }
  return undefined;
};

const getWikiContent = function(flowerName) {
  return new Promise((resolve, reject) => {
    request.get(
      "https://en.wikipedia.org/api/rest_v1/page/summary/" + flowerName,
      (err, response, body) => {
        if (err) {
          reject(err);
        } else {
          body = JSON.parse(body);
          if (body.type.includes("errors")) {
            reject(new Error("error getting flower information"));
          } else {
            resolve({
              wikiURL: body.content_urls.desktop.page,
              wikiExtract: body.extract
            });
          }
        }
      }
    );
  });
};

exports.getInfoFromImage = function(img) {
  const client = new vision.ImageAnnotatorClient();
  return new Promise((resolve, reject) => {
    client
      .labelDetection(img)
      .then(results => {
        const labels = results[0].labelAnnotations;
        const flowerName = getName(labels);
        if (flowerName) {
          getWikiContent(flowerName)
            .then(wikiContent => {
              resolve({
                flowerName: flowerName,
                wikiContent: wikiContent
              });
            })
            .catch(err => {
              console.error("ERROR:", err);
              reject(err);
            });
        } else {
          reject(new Error("ARE YOU SURE THE IMAGE CONTAINS A FLOWER?"));
        }
      })
      .catch(err => {
        console.error("ERROR:", err);
        reject(err);
      });
  });
};
