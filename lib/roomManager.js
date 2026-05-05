class RoomManager {
  constructor() {
    this.rooms = new Map(); // roomId -> Set of clients
  }

  joinRoom(roomId, client, username) {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Set());
    }
    const room = this.rooms.get(roomId);
    
    // Set client properties
    client.roomId = roomId;
    client.username = username || "guest";

    // Notify new client about existing peers
    room.forEach(peer => {
      if (peer.readyState === 1) {
        client.send(JSON.stringify({ 
          type: "nick_update", 
          username: peer.username,
          system: true 
        }));
      }
    });

    room.add(client);
    console.log(`Client ${client.username} joined room: ${roomId}`);
  }

  leaveRoom(client) {
    if (client.roomId && this.rooms.has(client.roomId)) {
      const room = this.rooms.get(client.roomId);
      room.delete(client);
      if (room.size === 0) {
        this.rooms.delete(client.roomId);
      }
      console.log(`Client ${client.username} left room: ${client.roomId}`);
    }
  }

  broadcast(client, message) {
    if (!client.roomId || !this.rooms.has(client.roomId)) return;

    const room = this.rooms.get(client.roomId);
    const payload = JSON.stringify(message);

    room.forEach(c => {
      if (c !== client && c.readyState === 1) {
        c.send(payload);
      }
    });
  }
}

module.exports = new RoomManager();
