let url = 'ws://localhost:8080/ws';
let ws = new WebSocket(url);
let id = 'user'.concat(~~(Math.random() * 1e6));

ws.onclose = event => console.log(`Closed ${event.code}`);

document.forms.sendmessage.onsubmit = function() {
    let messageOut = {
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
    displayMessage(reader.result);
  }
  
  reader.readAsText(messageIn);
};

function displayMessage(message) {
  message = JSON.parse(message);
  
  let messageDiv = document.createElement('div');
  messageDiv.classList.add('incoming');
  messageDiv.textContent = message.text;
  document.getElementById('chat').prepend(messageDiv);
  
  let userId = document.createElement('p');
  userId.classList.add('user');
  userId.textContent = message.id;
  document.getElementsByClassName('incoming')[0].prepend(userId);
  
  let timePoint = document.createElement('p');
  timePoint.classList.add('time');
  timePoint.textContent = new Date(message.date).toTimeString().slice(0, 8);
  document.getElementsByClassName('incoming')[0].prepend(timePoint);
}
