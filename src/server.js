const http = require('http');
const fs = require('fs');
const ws = new require('ws');
const wsServer = new ws.Server({ noServer: true });

const visitors = new Set();

http.createServer((req, res) => {
  console.log(req.url);
  if (req.url == '/ws' && req.headers.upgrade &&
    req.headers.upgrade.toLowerCase() == 'websocket' && req.headers.connection.match(/\bupgrade\b/i)) {
    wsServer.handleUpgrade(req, req.socket, Buffer.alloc(0), onSocketConnect);
    } else if (req.url == '/') {
      fs.createReadStream('./src/index.html').pipe(res);
    } else if (req.url == '/style.css') {
      fs.createReadStream('./src/style.css').pipe(res);
    } else if (req.url == '/chat.js') {
      fs.createReadStream('./src/chat.js').pipe(res);
    }
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
