# SecureChat-OS v2.0.0

A professional-grade, CLI-based encrypted chat application leveraging Firebase Realtime Database and AES-GCM 256-bit encryption for maximum security and zero-latency communication.

## Core Features
- **Terminal UI**: Premium hacker-style aesthetic with CRT effects, scanlines, and fluid animations.
- **Consensus Deletion**: New 'Kill Room' feature requiring multi-user agreement to purge sensitive data.
- **End-to-End Encryption**: Client-side encryption ensures no server-side plaintext data exposure.
- **Room Isolation**: Peer-to-peer room isolation via cryptographically derived keys from Room IDs.
- **CLI Commands**: Interactive terminal environment with native command support.

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
