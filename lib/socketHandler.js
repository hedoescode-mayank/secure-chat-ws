const roomManager = require("./roomManager");

function handleConnection(ws) {
  console.log("New connection established.");

  ws.on("message", (data) => {
    try {
      const message = JSON.parse(data);
      console.log(`Received message type: ${message.type} from ${ws.username || 'unknown'}`);

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
        console.log(`Broadcasting chat from ${ws.username}`);
        roomManager.broadcast(ws, {
          type: "chat",
          data: message.data,
          iv: message.iv,
          sender: ws.username
        });
        return;
      }

      if (message.type === "nick_update") {
        const oldName = ws.username;
        ws.username = message.username;
        console.log(`Name change: ${oldName} -> ${ws.username}`);
        roomManager.broadcast(ws, { 
          type: "nick_update", 
          username: ws.username 
        });
        return;
      }

      if (message.type === "delete_request" || message.type === "delete_confirm") {
        roomManager.broadcast(ws, message);
        return;
      }

      // --- WebRTC Signaling Relay ---
      // Just broadcast these to all other peers in the room; server never inspects media.
      if (
        message.type === "webrtc_offer" ||
        message.type === "webrtc_answer" ||
        message.type === "webrtc_ice" ||
        message.type === "webrtc_request" ||
        message.type === "webrtc_cancel"
      ) {
        console.log(`[WebRTC] Relaying ${message.type} from ${ws.username}`);
        roomManager.broadcast(ws, { ...message, from: ws.username });
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
