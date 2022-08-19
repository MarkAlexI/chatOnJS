const http = require('http');
const fs = require('fs');
const ws = new require('ws');
const wsServer = new ws.Server({ noServer: true });

const pathToDB = 'usersDB.txt';
const visitors = new Set();
let logins, activeUsers = new Map();

initUsers();

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
  
  function messagingStrategies(message) {
    let incomingMessage = JSON.parse(message);
    if (incomingMessage.type === "login") {
      let id = incomingMessage.id;
      let password = incomingMessage.text;
      
      function prepareMessage() {
        let result;
        
        if ((logins.has(id) && logins.get(id) !== password) || activeUsers.has(id)) {
          result = makeMessage("reject", "Username already online! Please choose a different username.");
        }
        
        if (!activeUsers.has(id)) {
          ws.id = id;
          activeUsers.set(id, password);
          
          result = makeMessage("login", id);
        }

        if (!logins.has(id)) {console.log('save' + id + ':' + password);
          fs.appendFile(
            pathToDB,
            (logins.size === 0 ? '' : '\n') + id + ':' + password,
            function(error) {
              if (error) throw error;
            });
          
          logins.set(id, password);
        }
        
        return JSON.stringify(result);
      }
      
      let outMessage = Buffer.from(prepareMessage());

      sendPrivate(outMessage);
    }
    if (incomingMessage.type === "message") {
      sendToEveryone(message);
    }
  }
  
  ws.on('message', function (message) {
    messagingStrategies(message);
  });
  
  ws.on('close', function() {
    activeUsers.delete(ws.id);
    visitors.delete(ws);
  });
}

function initUsers() {
  console.log('init');

  if (!fs.existsSync(pathToDB)) {
    fs.writeFileSync(pathToDB, '', 'utf8');
  }
  
  let readFromDB = fs.readFileSync(pathToDB, 'utf8');
  
  logins = new Map(readFromDB.length === 0
                   ? void 0
                   : readFromDB.split`\n`.map(el => el.split`:`));
}

function makeMessage(type, text) {
  return {
    type: type,
    text: text,
    id: "server",
    date: Date.now(),
  };
}
