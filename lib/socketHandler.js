const roomManager = require("./roomManager");

function handleConnection(ws) {
  console.log("New connection established.");

  ws.on("message", (data) => {
    try {
      const message = JSON.parse(data);

      if (message.type === "join") {
        roomManager.joinRoom(message.roomId, ws, message.username);
        ws.send(JSON.stringify({ type: "system", text: `Secure channel established in room: ${message.roomId}` }));
        
        // Notify others about the new peer
        roomManager.broadcast(ws, { 
          type: "nick_update", 
          username: ws.username 
        });
        return;
      }

      if (message.type === "chat") {
        roomManager.broadcast(ws, {
          type: "chat",
          data: message.data,
          iv: message.iv,
          sender: ws.username
        });
        return;
      }

      if (message.type === "nick_update") {
        ws.username = message.username;
        roomManager.broadcast(ws, { 
          type: "nick_update", 
          username: ws.username 
        });
        return;
      }

      // Handle other types (delete_request, delete_confirm)
      if (message.type === "delete_request" || message.type === "delete_confirm") {
        roomManager.broadcast(ws, message);
        return;
      }

    } catch (err) {
      console.error("Error processing message:", err);
    }
  });

  ws.on("close", () => {
    roomManager.leaveRoom(ws);
  });
}

module.exports = { handleConnection };
