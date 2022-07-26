let url = 'ws://localhost:8080/ws';
let ws = new WebSocket(url);

ws.onclose = event => console.log(`Closed ${event.code}`);

document.forms.sendmessage.onsubmit = function() {
    let outMessage = this.message.value;
    ws.send(outMessage);
    ws.close();
    return false;
  };

console.log('Work!');
