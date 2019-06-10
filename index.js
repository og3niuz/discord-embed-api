var http = require('http');
var fs = require("fs");

var embeds = {};

function randomString(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

http.createServer(function(request, response) {
  var url = decodeURIComponent(request.url);
  if (url == "/favicon.ico") {
    response.writeHead(200, {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": "attachment; filename=favicon.ico"
    });
    fs.createReadStream("./favicon.ico").pipe(response);
    return;
  } else if (url.startsWith("/create")) {
    console.log("User requested an embed: " + url);

    var embedID = randomString(10);
    while (embeds[embedID]) {
      embedID = randomString(10);
    }
    embeds[embedID] = {
      providerName: "providerName",
      providerUrl: "https://provider.url/",
      authorName: "authorName",
      authorUrl: "https://author.url/",
      title: "title",
      description: "description",
      imageUrl: "https://image.url/",
      banner: false,
      color: "#color"
    };

    response.writeHead(200, {
      'Content-Type': 'text/plain'
    });
    response.end("/embed/" + embedID);
  } else if (url.startsWith("/embed/")) {
    var embedID = url.replace("/embed/", "");

    response.writeHead(200, {
      'Content-Type': 'text/plain'
    });
    response.end(JSON.stringify(embeds[embedID], null, 2));
  } else {
    response.writeHead(200, {
      'Content-Type': 'text/plain'
    });
    response.end("Do you need something?");
  }
}).listen(process.env.PORT || 5000);

console.log("Server started!");
