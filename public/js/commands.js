const CommandProcessor = {
  commands: {
    "/help": (args, app) => {
      app.terminal.print("Available commands:", "info");
      app.terminal.print("  /help    - Show this help message");
      app.terminal.print("  /clear   - Clear the terminal");
      app.terminal.print("  /info    - Show session information");
      app.terminal.print("  /room    - Show current room ID");
    },
    "/clear": (args, app) => {
      app.terminal.clear();
    },
    "/info": (args, app) => {
      app.terminal.print(`Session: ${app.roomId}`, "info");
      app.terminal.print(`Status: Connected`, "info");
      app.terminal.print(`Encryption: AES-GCM 256-bit`, "info");
    },
    "/room": (args, app) => {
      app.terminal.print(`Current room: ${app.roomId}`, "info");
    }
  },

  process(input, app) {
    const parts = input.trim().split(" ");
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (this.commands[cmd]) {
      this.commands[cmd](args, app);
      return true;
    }
    return false;
  }
};

window.CommandProcessor = CommandProcessor;
