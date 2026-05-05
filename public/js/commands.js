const CommandProcessor = {
  commands: {
    "/help": (args, app) => {
      app.terminal.print("Available commands:", "info");
      app.terminal.print("  /help           - Show this help message");
      app.terminal.print("  /clear          - Clear the terminal");
      app.terminal.print("  /info           - Show session information");
      app.terminal.print("  /room           - Show current room ID");
      app.terminal.print("  /nick <name>    - Change your display name");
      app.terminal.print("  /delete         - Request to delete the room (requires peer consent)");
    },
    "/clear": (args, app) => {
      app.terminal.clear();
    },
    "/info": (args, app) => {
      app.terminal.print(`Session: ${app.roomId}`, "info");
      app.terminal.print(`Username: ${app.username}`, "info");
      app.terminal.print(`Status: Connected`, "info");
      app.terminal.print(`Encryption: AES-GCM 256-bit`, "info");
    },
    "/room": (args, app) => {
      app.terminal.print(`Current room: ${app.roomId}`, "info");
    },
    "/nick": (args, app) => {
      if (args.length === 0) {
        app.terminal.print("Usage: /nick <new_name>", "error");
        return;
      }
      const newName = args.join(" ").slice(0, 15);
      app.username = newName;
      app.terminal.setPrompt(`${newName}@secure-chat:${app.roomId}$ `);
      app.terminal.print(`Username changed to: ${newName}`, "system");
      
      // Notify peer about name change
      app.socket.send("nick_update", { username: newName });
    },
    "/delete": (args, app) => {
      if (app.deleteRequestReceived) {
        app.terminal.print("Agreement reached. Deleting room...", "system");
        app.socket.send("delete_confirm", {});
        app.confirmDeletion();
      } else {
        app.terminal.print("Delete request sent. Waiting for peer consent...", "info");
        app.socket.send("delete_request", {});
      }
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
