'use strict';
import './style.css';

let url = 'ws://localhost:8080/ws';
let ws = new WebSocket(url);
let id = '';

login_btn.addEventListener('click', autorize);

function autorize() {
  let login = document.getElementById('login').value;

 let password = document.getElementById('password').value;

  if (!login.length || /\W/.test(login)) {
    loginReject('Wrong symbols. Try again.', 'login');
    return;
  }

 if (!password.length || /\W/.test(password)) {
   loginReject('Uncorrect password.', 'password');
   return;
 }

  ws.send(JSON.stringify({
    type: "login",
    text: password,
    id: login,
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

function loginReject(text, field = 'login') {
  document.getElementById(field).value = '';
  document.getElementById(field).placeholder = text;
  return;
}

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
  messageProcessing(event.data);
};

function messageProcessing(messageIn) {
  let reader = new FileReader();
  
  reader.onload = function() {
    let message = JSON.parse(reader.result);

    if (message.type === "login") {
      setId(message.text.split`:`[0]);
      displayMessage(message);
    }
    if (message.type === "reject") {
      loginReject(message.text);
    }
    if (message.type === "message") {
      displayMessage(message);
    }
  }
  
  reader.readAsText(messageIn);
}

function displayMessage(message) {
  
  let messageDiv = document.createElement('div');
  messageDiv.classList.add('incoming');
  messageDiv.textContent =
    message.type === "message"
    ? message.text
    : `User ${message.text} join to chat.`;
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
