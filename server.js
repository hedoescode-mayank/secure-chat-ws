const express = require("express");
const path = require("path");
const WebSocket = require("ws");
const { PORT } = require("./config/constants");
const { handleConnection } = require("./lib/socketHandler");

const app = express();

// Serve static files from the root and public directories
app.use(express.static(__dirname));
app.use("/public", express.static(path.join(__dirname, "public")));

// Redirect all other requests to index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const server = app.listen(PORT, () => {
  console.log(`
  =======================================
  SecureChat-OS v2.0.0
  HTTP & WebSocket server running
  Local: http://localhost:${PORT}
  =======================================
  `);
});

const wss = new WebSocket.Server({ server });

wss.on("connection", handleConnection);

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});
