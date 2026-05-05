class App {
  constructor() {
    this.terminal = new Terminal("terminal", "input");
    this.service = new FirebaseService();
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
    document.getElementById("terminal").style.display = "flex";
    document.querySelector(".prompt-container").style.display = "flex";
    document.getElementById("input").focus();

    await this.terminal.printBootSequence();
    this.terminal.print(`Connected to room: ${this.roomId}`, "system");
    this.terminal.setPrompt(`${this.username}@secure-chat:${this.roomId}$ `);

    await CryptoUtils.deriveKey(this.roomId);
    this.service.setRoom(this.roomId);
    this.setupHandlers();
    
    // Announce join
    this.service.send("join", { username: this.username });
  }

  setupHandlers() {
    this.service.onMessageCallback = async (message) => {
      if (message.sender === this.username) return; // Ignore own messages from DB

      if (message.type === "chat") {
        try {
          const decrypted = await CryptoUtils.decrypt({ iv: message.iv, data: message.data });
          this.terminal.print(`[${message.sender}]: ${decrypted}`, "user-msg");
        } catch (e) {
          this.terminal.print("Failed to decrypt incoming message", "error");
        }
      } else if (message.type === "delete_request") {
        this.deleteRequestReceived = true;
        this.terminal.print("!! Peer has requested to delete this room. Type /delete to confirm !!", "system");
      }
    };

    this.service.onNickUpdateCallback = (data) => {
      if (data.username !== this.username) {
        this.peerName = data.username;
        this.terminal.print(`Peer identity synced: ${data.username}`, "info");
      }
    };

    this.service.onDeleteCallback = () => {
      this.confirmDeletion();
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
          this.service.send("chat", { 
            data: encrypted.data, 
            iv: encrypted.iv, 
            sender: this.username 
          });
        } catch (e) {
          this.terminal.print("Encryption failed", "error");
        }
      }
    });
  }

  confirmDeletion() {
    this.terminal.clear();
    this.terminal.print("ROOM DELETED BY MUTUAL AGREEMENT", "system");
    this.terminal.print("Session terminated. Data purged.", "info");
    this.terminal.input.disabled = true;
    this.service.clearRoom();
  }
}

window.onload = () => {
  new App();
};
