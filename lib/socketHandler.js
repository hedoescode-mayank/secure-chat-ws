const roomManager = require("./roomManager");

function handleConnection(ws) {
  console.log("New connection established.");

  ws.on("message", (data) => {
    try {
      const message = JSON.parse(data);

      if (message.type === "join") {
        roomManager.joinRoom(message.roomId, ws);
        ws.send(JSON.stringify({ type: "system", text: `Joined room: ${message.roomId}` }));
        return;
      }

      if (message.type === "chat") {
        roomManager.broadcast(ws, {
          type: "chat",
          data: message.data,
          iv: message.iv
        });
        return;
      }
    } catch (err) {
      console.error("Error processing message:", err);
    }
  });

  ws.on("close", () => {
    roomManager.leaveRoom(ws);
    console.log("Connection closed.");
  });

  ws.on("error", (err) => {
    console.error("WebSocket error:", err);
  });
}

module.exports = { handleConnection };
