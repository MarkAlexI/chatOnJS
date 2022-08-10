//import { Blob } from 'buffer';

const http = require('http');
const fs = require('fs');
const ws = new require('ws');
const wsServer = new ws.Server({ noServer: true });

const visitors = new Set();
const logins = new Set();

process.on('uncaughtException', err => {
  console.log('on uncaughtException: ' + err.message);
});

http.createServer(access).listen(8080);

function access(req, res) {
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
  } else {
    res.statusCode = 404;
    res.end('No path to follow');
  }
}

function onSocketConnect(ws) {
  visitors.add(ws);

  function sendToEveryone(message) {
    for (let visitor of visitors) {
      visitor.send(message);
    }
  }

  function sendPrivate(message) {
    ws.send(message);
  }
  
  ws.on('message', function(message) {
    let incomingMessage = JSON.parse(message);
    if (incomingMessage.type === "login") {
      let outMessage = Buffer.from(JSON.stringify(
        logins.has(incomingMessage.id) ?
        {
          type: "reject",
          text: "Username already exists! Please choose a different username.",
          id: "server",
          date: Date.now(),
        } :
        (
          logins.add(incomingMessage.id),
        {
         type: "login",
         text: incomingMessage.id,
         id: "server",
         date: Date.now(),
        })
      ));
      sendPrivate(outMessage);
    }
    if (incomingMessage.type === "message") {
      sendToEveryone(message);
    }
  });

  ws.on('close', function() {
    visitors.delete(ws);
  });
}
