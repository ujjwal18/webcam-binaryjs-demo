var http = require('http')
  , url = require('url')
  , fs = require('fs')
  // ,ffmpeg = require('../index')
  // , indexHtml = fs.readFileSync('./public/index.html')
  // , otroHtml = fs.readFileSync('./public/viewer.html')
  , sendHtml = fs.readFileSync('./public/send.html')
  , reciveHtml = fs.readFileSync('./public/recive.html')
  , BinaryServer = require('binaryjs').BinaryServer
  , binaryServer = BinaryServer({port: 9000});

// Serv the static page..

var server = http.createServer(function(request, response) {
  var pathname = url.parse(request.url).pathname;
  // console.log(pathname);
  response.writeHead(200);
  // if (pathname == '/') {
  //   response.end(indexHtml);  
  // } else if (pathname == '/otro') {
  //   response.end(otroHtml);
  // };
   if (pathname == '/') {
    response.end(sendHtml);  
  } else if (pathname == '/recive') {
    response.end(reciveHtml);
  }else {
    try{
      response.end(fs.readFileSync('./public/'+pathname));
    }catch (error){
      response.writeHead(404);
      response.end();
    }
    
  }
  
});

// WebServer listens on Port 4000

server.listen(4000);

// Handle Binary WebSockets..
var broadcastStream = null ;

binaryServer.on('connection', function(client) {
  // client.on('close', function(code, message) {
  //   console.log(code, message );
  //   console.log(binaryServer.clients);
  // });
// console.log(client);
  
/*
  client.on('stream', function(stream, meta) {
    if (meta == 'toserver'){
      console.log(binaryServer.clients);
      for (var id in binaryServer.clients) {
        var viewerClient = binaryServer.clients[id];
        console.log(viewerClient);
        if (viewerClient != client) {
          var send = viewerClient.createStream("fromserver");
          stream.pipe(send);
        };
      };
    };
  });
  */
  client.on('stream', function(stream, meta) {
    // console.log(meta);
    if (meta == 'toserver'){
      broadcastStream = stream ;

      for (var id in binaryServer.clients) {
        var viewerClient = binaryServer.clients[id];
        // console.log(viewerClient);
        if (viewerClient != client) {
          var send = viewerClient.createStream("fromserver");
          stream.pipe(send);
        };
      };
    }else{
      if(broadcastStream!= null){
        var send = client.createStream("fromserver");
        broadcastStream.pipe(send);
      }
      

    }
  });
});