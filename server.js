const WebSocket = require("ws");
const { PORT } = require("./config/constants");
const { handleConnection } = require("./lib/socketHandler");

const wss = new WebSocket.Server({ port: PORT }, () => {
  console.log(`
  =======================================
  SecureChat-OS Backend v2.0.0
  WebSocket server running on port: ${PORT}
  =======================================
  `);
});

wss.on("connection", handleConnection);

// Basic health check for the server
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});
