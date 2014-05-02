var http = require('http')
  , url = require('url')
  , fs = require('fs')
  , indexHtml = fs.readFileSync('./public/index.html')
  , otroHtml = fs.readFileSync('./public/viewer.html')
  , BinaryServer = require('binaryjs').BinaryServer
  , binaryServer = BinaryServer({port: 9000});

// Serv the static page..

var server = http.createServer(function(request, response) {
  var pathname = url.parse(request.url).pathname;
  response.writeHead(200);
  if (pathname == '/') {
    response.end(indexHtml);  
  } else if (pathname == '/otro') {
    response.end(otroHtml);
  };
  
});

// WebServer listens on Port 4000

server.listen(4000);

// Handle Binary WebSockets..

binaryServer.on('connection', function(client) {
  client.on('stream', function(stream, meta) {
    if (meta == 'toserver'){
      for (var id in binaryServer.clients) {
        var viewerClient = binaryServer.clients[id];
        if (viewerClient != client) {
          var send = viewerClient.createStream("fromserver");
          stream.pipe(send);
        };
      };
    };
  });

});