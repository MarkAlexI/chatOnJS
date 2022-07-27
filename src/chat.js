let url = 'ws://localhost:8080/ws';
let ws = new WebSocket(url);

ws.onclose = event => console.log(`Closed ${event.code}`);

document.forms.sendmessage.onsubmit = function() {
    let messageOut = this.message.value;
    ws.send(messageOut);
    return false;
  };

ws.onmessage = function(event) {
  let messageIn = event.data;
  displayMessage(messageIn);
};

function displayMessage(message) {
  let messageDiv = document.createElement('div');
  messageDiv.textContent = message;
  document.getElementById('chat').prepend(messageDiv);
}
