class App {
  constructor() {
    this.terminal = new Terminal("terminal", "input");
    this.socket = new SocketClient(`ws://${window.location.hostname}:4000`);
    this.roomId = this.getRoomId();
    this.setupHandlers();
  }

  getRoomId() {
    if (!location.hash) {
      const room = crypto.randomUUID().slice(0, 8);
      location.hash = "room=" + room;
    }
    return location.hash.replace("#room=", "");
  }

  async init() {
    await this.terminal.printBootSequence();
    this.terminal.print(`Connected to room: ${this.roomId}`, "system");
    this.terminal.setPrompt(`user@secure-chat:${this.roomId}$ `);

    await CryptoUtils.deriveKey(this.roomId);
    this.socket.connect();
  }

  setupHandlers() {
    this.socket.onOpenCallback = () => {
      this.socket.joinRoom(this.roomId);
    };

    this.socket.onMessageCallback = async (message) => {
      if (message.type === "chat") {
        try {
          const decrypted = await CryptoUtils.decrypt({ iv: message.iv, data: message.data });
          this.terminal.print(`peer: ${decrypted}`, "user-msg");
        } catch (e) {
          this.terminal.print("Failed to decrypt incoming message", "error");
        }
      } else if (message.type === "system") {
        this.terminal.print(message.text, "info");
      }
    };

    this.terminal.input.addEventListener("keydown", async (e) => {
      if (e.key === "Enter") {
        const value = this.terminal.input.value.trim();
        if (!value) return;

        this.terminal.input.value = "";
        
        if (value.startsWith("/")) {
          if (CommandProcessor.process(value, this)) return;
        }

        this.terminal.print(`you: ${value}`, "user-msg");
        
        try {
          const encrypted = await CryptoUtils.encrypt(value);
          this.socket.sendChat(encrypted.data, encrypted.iv);
        } catch (e) {
          this.terminal.print("Encryption failed", "error");
        }
      }
    });
  }
}

window.onload = () => {
  const app = new App();
  app.init();
};
