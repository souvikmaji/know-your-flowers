var http = require("http");
var Router = require("router");
var fs = require("fs");
var finalhandler = require("finalhandler");
var vision = require("@google-cloud/vision")({
  projectId: "state-game-1492489545950",
  keyFilename: "./state game-c247d07043ad.json"
});

var router = Router();
var server = http.createServer(function onRequest(req, res) {
  router(req, res, finalhandler(req, res));
});

router.get("/", function(req, res) {
  fs.readFile("index.html", function(err, data) {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/html" });
      return res.end("500: INTERNAL SERVER ERROR");
    }
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(data);
    return res.end();
  });
});

router.get("/main.css", function(req, res) {
  fs.readFile("main.css", function(err, data) {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/html" });
      return res.end();
    }
    res.writeHead(200, { "Content-Type": "text/css" });
    res.write(data);
    return res.end();
  });
});

router.get("/ok.jpg", function(req, res) {
  fs.readFile("ok.jpg", function(err, data) {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/html" });
      return res.end();
    }
    res.writeHead(200, { "Content-Type": "image/jpg" });
    res.write(data);
    return res.end();
  });
});

router.post("/", function(req, res) {
  var imageSrc,
    reply = {};

  req.on("data", function(data) {
    imageSrc += data;
  });

  req.on("end", function() {
    const imgBuffer = new Buffer(imageSrc, "binary").toString("base64");
    fs.writeFile("output2.txt", imgBuffer, function(err) {
      if (err) {
        return console.log(err);
      }
      console.log("The file was saved!");
    });
    var request = {
      image: { content: imgBuffer },
      features: [
        {
          type: "WEB_DETECTION",
          maxResults: 1
        }
      ]
    };
    // vision
    // .annotateImage(request)
    // .then(response => {
    //   console.log("response:", response);
    //   reply.response = response;
    //   res.writeHead(200, { "Content-Type": "application/json" });
    //   return res.write(reply);
    // })
    // .catch(err => {
    //   console.error("Error:", err);
    //   reply.response = err;
    //   res.writeHead(200, { "Content-Type": "application/json" });
    //   return res.write(reply);
    // });
  });
});

router.use(function(req, res) {
  res.writeHead(404, { "Content-Type": "text/html" });
  res.end("404: URL Not Found.");
});

server.listen(8080);
