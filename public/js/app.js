class App {
  constructor() {
    this.terminal = new Terminal("terminal", "input");
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    this.socket = new SocketClient(`${protocol}://${window.location.host}`);
    this.roomId = this.getRoomId();
    this.username = "guest";
    this.peerName = "peer";
    this.deleteRequestReceived = false;
    
    this.setupNicknameBox();
  }

  getRoomId() {
    if (!location.hash) {
      const room = crypto.randomUUID().slice(0, 8);
      location.hash = "room=" + room;
    }
    return location.hash.replace("#room=", "");
  }

  setupNicknameBox() {
    const overlay = document.getElementById("nickname-overlay");
    const input = document.getElementById("nickname-input");

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const val = input.value.trim();
        if (val) {
          this.username = val;
          overlay.style.display = "none";
          this.startTerminal();
        }
      }
    });
  }

  async startTerminal() {
    document.getElementById("terminal").style.display = "block";
    document.querySelector(".prompt-container").style.display = "flex";
    document.getElementById("input").focus();

    await this.terminal.printBootSequence();
    this.terminal.print(`Connected to room: ${this.roomId}`, "system");
    this.terminal.setPrompt(`${this.username}@secure-chat:${this.roomId}$ `);

    await CryptoUtils.deriveKey(this.roomId);
    this.socket.connect();
    this.setupHandlers();
  }

  setupHandlers() {
    this.socket.onOpenCallback = () => {
      // Send username during join
      this.socket.send("join", { 
        roomId: this.roomId, 
        username: this.username 
      });
    };

    this.socket.onMessageCallback = async (message) => {
      switch (message.type) {
        case "chat":
          try {
            const decrypted = await CryptoUtils.decrypt({ iv: message.iv, data: message.data });
            const sender = message.sender || this.peerName;
            this.terminal.print(`[${sender}]: ${decrypted}`, "user-msg");
          } catch (e) {
            this.terminal.print("Failed to decrypt incoming message", "error");
          }
          break;

        case "system":
          this.terminal.print(message.text, "info");
          break;

        case "nick_update":
          this.peerName = message.username;
          if (!message.system) {
            this.terminal.print(`Peer joined as: ${message.username}`, "info");
          }
          break;

        case "delete_request":
          this.deleteRequestReceived = true;
          this.terminal.print("!! Peer has requested to delete this room. Type /delete to confirm !!", "system");
          break;

        case "delete_confirm":
          this.confirmDeletion();
          break;
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

        this.terminal.print(`[${this.username}]: ${value}`, "user-msg");
        
        try {
          const encrypted = await CryptoUtils.encrypt(value);
          this.socket.sendChat(encrypted.data, encrypted.iv, this.username);
        } catch (e) {
          this.terminal.print("Encryption failed", "error");
        }
      }
    });
  }

  confirmDeletion() {
    this.terminal.clear();
    this.terminal.print("ROOM DELETED BY MUTUAL AGREEMENT", "system");
    this.terminal.print("Connection terminated. Refresh to join a new room.", "info");
    this.socket.socket.close();
    this.terminal.input.disabled = true;
  }
}

window.onload = () => {
  new App();
};
