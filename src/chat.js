let url = 'ws://localhost:8080/ws';
let ws = new WebSocket(url);

ws.onclose = event => console.log(`Closed ${event.code}`);

document.forms.sendmessage.onsubmit = function() {
    let messageOut = this.message.value;
    ws.send(messageOut);
   // ws.close();
    return false;
  };

ws.onmessage = function(event) {
  let messageIn = event.data;
  console.log(messageIn);
};
