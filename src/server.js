const http = require('http');
const fs = require('fs');
const ws = new require('ws');
const wsServer = new ws.Server({ noServer: true });

const visitors = new Set();

http.createServer((req, res) => {
  wsServer.handleUpgrade(req, req.socket, Buffer.alloc(0), onSocketConnect);
}).listen(8080);

function onSocketConnect(ws) {
  visitors.add(ws);

  ws.on('message', function(message) {
    for (let visitor of visitors) {
      visitor.send(message);
    }
  });

  ws.on('close', function() {
    visitors.delete(ws);
  });
}
