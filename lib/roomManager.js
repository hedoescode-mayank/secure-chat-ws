class RoomManager {
  constructor() {
    this.rooms = new Map(); // roomId -> Set of clients
  }

  joinRoom(roomId, client) {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Set());
    }
    this.rooms.get(roomId).add(client);
    client.roomId = roomId;
    console.log(`Client joined room: ${roomId}`);
  }

  leaveRoom(client) {
    if (client.roomId && this.rooms.has(client.roomId)) {
      const room = this.rooms.get(client.roomId);
      room.delete(client);
      if (room.size === 0) {
        this.rooms.delete(client.roomId);
      }
      console.log(`Client left room: ${client.roomId}`);
    }
  }

  broadcast(client, message) {
    if (!client.roomId || !this.rooms.has(client.roomId)) return;

    const room = this.rooms.get(client.roomId);
    const payload = JSON.stringify(message);

    room.forEach(c => {
      if (c !== client && c.readyState === 1) { // 1 = WebSocket.OPEN
        c.send(payload);
      }
    });
  }

  getRoomCount(roomId) {
    return this.rooms.has(roomId) ? this.rooms.get(roomId).size : 0;
  }
}

module.exports = new RoomManager();
