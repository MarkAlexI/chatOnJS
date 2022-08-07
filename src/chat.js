'use strict';

let url = 'ws://localhost:8080/ws';
let ws = new WebSocket(url);
let id = '';

if (ws.readyState === 0) {
  console.log('connecting');
}

function autorize() {
  let login = document.getElementById('login').value;

  if (!login.length || /\W/.test(login)) {
    document.getElementById('login').value = '';
    document.getElementById('login').placeholder = 'Wrong symbols. Try again.';
    return;
  }

  ws.send(JSON.stringify({
    type: "login",
    id: login,
    text: "",
    date: Date.now(),
  }));
}

function setId(login) {
  id = login;
  document.getElementsByClassName('autorize')[0].style.display = 'none';
  document.getElementsByClassName('typing')[0].style.display = 'block';
  document.getElementById('chat').style.display = 'block';
}

ws.onclose = event => {
  console.log(`Closed ${event.code}`);
  document.getElementsByClassName('wrapper')[0].style.display = 'none';
  document.body.textContent = 'Server died...';
};

document.forms.sendmessage.onsubmit = function() {
    let messageOut = {
      type: "message",
      text: this.message.value,
      id: id,
      date: Date.now(),
    };
    ws.send(JSON.stringify(messageOut));
    return false;
  };

ws.onmessage = function(event) {
  let messageIn = event.data;
  let reader = new FileReader();
  
  reader.onload = function() {
    let message = JSON.parse(reader.result);
    
    if (message.type === "login") {
      console.log(message.text);
      setId(message.text);
    }
    if (message.type === "message") {
      displayMessage(message);
    }
  }
  
  reader.readAsText(messageIn);
};

function displayMessage(message) {
  
  let messageDiv = document.createElement('div');
  messageDiv.classList.add('incoming');
  messageDiv.textContent = message.text;
  document.getElementById('chat').prepend(messageDiv);
  
  let userId = document.createElement('div');
  userId.classList.add('user');
  userId.textContent = message.id;
  document.getElementsByClassName('incoming')[0].prepend(userId);
  
  let timePoint = document.createElement('span');
  timePoint.classList.add('time');
  timePoint.textContent = ' at ' + new Date(message.date).toTimeString().slice(0, 8);
  document.getElementsByClassName('user')[0].append(timePoint);
}
