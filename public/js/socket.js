class SocketClient {
  constructor(url) {
    this.url = url;
    this.socket = null;
    this.onMessageCallback = null;
    this.onOpenCallback = null;
    this.onCloseCallback = null;
  }

  connect() {
    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      console.log("Connected to server");
      if (this.onOpenCallback) this.onOpenCallback();
    };

    this.socket.onmessage = (event) => {
      if (this.onMessageCallback) {
        this.onMessageCallback(JSON.parse(event.data));
      }
    };

    this.socket.onclose = () => {
      console.log("Disconnected from server");
      if (this.onCloseCallback) this.onCloseCallback();
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }

  send(type, payload) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type, ...payload }));
    }
  }

  joinRoom(roomId) {
    this.send("join", { roomId });
  }

  sendChat(data, iv, sender) {
    this.send("chat", { data, iv, sender });
  }
}

window.SocketClient = SocketClient;
