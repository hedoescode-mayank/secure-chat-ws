Secure Room Chat
Secure Room Chat is a lightweight, browser-based encrypted chat application built with HTML, CSS, and JavaScript. It provides ephemeral, end-to-end encrypted communication using the Web Crypto API and WebSockets.

Features
Room generation: Each session creates a unique room ID using crypto.randomUUID().

End-to-end encryption: Messages are encrypted with AES-GCM and keys derived via PBKDF2.

Ephemeral messages: Messages self-destruct after 40 seconds to maintain privacy.

WebSocket support: Real-time communication with a backend server (ws://localhost:4000).

Minimal UI: Clean, dark-themed interface with responsive design.

How It Works
When the app loads, a random room ID is generated and displayed in the header.

Messages typed into the input box are encrypted before being sent over WebSocket.

Incoming messages are decrypted and displayed in the chat window.

Each message includes a countdown timer and is automatically deleted after 40 seconds.

Tech Stack
Frontend: HTML, CSS, Vanilla JavaScript

Crypto: Web Crypto API (AES-GCM, PBKDF2)

Backend: WebSocket server (example implementation with Node.js  ws)

Setup
Clone the repository:

bash
git clone https://github.com/your-username/secure-room-chat.git
cd secure-room-chat
Start a WebSocket server (for example, using Node.js  and the ws package):

bash
npm install ws
node server.js
Open index.html in your browser to start a secure chat session.

Notes
The current implementation connects to ws://localhost:4000. Update the WebSocket URL in the script if deploying to a remote server.

Messages are encrypted and decrypted entirely in the browser using the Web Crypto API.
Here’s a clean, professional **README.md** draft for your Secure Room Chat project, without emojis:

---

# Secure Room Chat

Secure Room Chat is a lightweight, browser-based encrypted chat application built with HTML, CSS, and JavaScript. It provides ephemeral, end-to-end encrypted communication using the Web Crypto API and WebSockets.

## Features

- **Room generation**: Each session creates a unique room ID using `crypto.randomUUID()`.
- **End-to-end encryption**: Messages are encrypted with AES-GCM and keys derived via PBKDF2.
- **Ephemeral messages**: Messages self-destruct after 40 seconds to maintain privacy.
- **WebSocket support**: Real-time communication with a backend server (`ws://localhost:4000`).
- **Minimal UI**: Clean, dark-themed interface with responsive design.

## How It Works

1. When the app loads, a random room ID is generated and displayed in the header.
2. Messages typed into the input box are encrypted before being sent over WebSocket.
3. Incoming messages are decrypted and displayed in the chat window.
4. Each message includes a countdown timer and is automatically deleted after 40 seconds.

## Tech Stack

- **Frontend**: HTML, CSS, Vanilla JavaScript
- **Crypto**: Web Crypto API (AES-GCM, PBKDF2)
- **Backend**: WebSocket server (example implementation with Node.js `ws`)

## Setup

1. Clone the repository:
   ```bash
   git clone (https://github.com/hedoescode-mayank/secure-chat-ws)
   cd secure-room-chat
   ```

2. Start a WebSocket server (for example, using Node.js and the `ws` package):
   ```bash
   npm install ws
   node server.js
   ```

3. Open `index.html` in your browser to start a secure chat session.

## Notes

- The current implementation connects to `ws://localhost:4000`. Update the WebSocket URL in the script if deploying to a remote server.
- Messages are encrypted and decrypted entirely in the browser using the Web Crypto API.
- This project is intended as a demonstration of secure, ephemeral chat and should be extended for production use.

