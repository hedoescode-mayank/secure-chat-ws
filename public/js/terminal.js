class Terminal {
  constructor(elementId, inputId) {
    this.container = document.getElementById(elementId);
    this.input = document.getElementById(inputId);
    this.history = [];
  }

  print(text, type = "default") {
    const line = document.createElement("div");
    line.className = `line ${type}`;
    
    if (type === "system") {
      line.innerHTML = `<span class="prompt-symbol">>></span> ${text}`;
    } else {
      line.textContent = text;
    }

    this.container.appendChild(line);
    this.container.scrollTop = this.container.scrollHeight;
  }

  clear() {
    this.container.innerHTML = "";
  }

  async printBootSequence() {
    const lines = [
      "Initializing SecureChat-OS v2.0.0...",
      "Loading kernel modules...",
      "Establishing encrypted tunnel...",
      "Handshaking with peer...",
      "Session verified. Welcome, user."
    ];

    for (const line of lines) {
      this.print(line, "info");
      await new Promise(r => setTimeout(r, 400));
    }
  }

  setPrompt(text) {
    document.querySelector(".prompt-label").textContent = text;
  }
}

window.Terminal = Terminal;
