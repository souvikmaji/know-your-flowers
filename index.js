var http = require("http");
var fs = require("fs");

http
  .createServer(function(req, res) {
    fs.readFile("index.html", function(err, data) {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/html" });
        return res.end("INTERNAL SERVER ERROR");
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      return res.end();
    });
  })
  .listen(8080);
