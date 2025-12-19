const WebSocket = require("ws");

const PORT = process.env.PORT || 4000;
const wss = new WebSocket.Server({ port: PORT });

let clients = [];

console.log("WebSocket server running on port", PORT);

wss.on("connection", ws => {
  if (clients.length >= 2) {
    ws.close();
    return;
  }

  clients.push(ws);

  ws.on("message", msg => {
    clients.forEach(c => {
      if (c !== ws && c.readyState === WebSocket.OPEN) {
        c.send(msg.toString());
      }
    });
  });

  ws.on("close", () => {
    clients = clients.filter(c => c !== ws);
  });
});
