# SecureChat-OS v2.0.0

A professional-grade, CLI-based encrypted chat application using WebSockets and AES-GCM 256-bit encryption.

## Features
- **Terminal UI**: Premium hacker-style aesthetic with CRT effects and scanlines.
- **End-to-End Encryption**: Messages are encrypted in the browser using AES-GCM.
- **Room Isolation**: Backend-enforced message isolation based on room ID.
- **Modular Architecture**: Cleanly separated concerns for scalability.
- **CLI Commands**: Built-in commands like `/help`, `/clear`, and `/info`.

## Architecture
- **Backend**: Node.js + WebSocket (`ws`)
  - `lib/roomManager.js`: Handles room logic.
  - `lib/socketHandler.js`: Manages socket events.
- **Frontend**: Vanilla JS + CSS
  - `public/js/crypto.js`: SubleCrypto implementation.
  - `public/js/terminal.js`: UI engine.

## Installation
1. `npm install`
2. `npm start`

## Usage
- Open `index.html` in your browser.
- Share the URL with the hash (e.g., `#room=xyz`) with a peer.
- Type messages or commands directly into the terminal.

---
*chips khao maje karo ,masti naa kare jii naa kare* 🔒
