# SecureChat-OS v2.0.0

A professional-grade, CLI-based encrypted chat application leveraging Firebase Realtime Database and AES-GCM 256-bit encryption for maximum security and zero-latency communication.

## Core Features
- **Terminal UI**: Premium hacker-style aesthetic with CRT effects, scanlines, and fluid animations.
- **Consensus Deletion**: New 'Kill Room' feature requiring multi-user agreement to purge sensitive data.
- **End-to-End Encryption**: Client-side encryption ensures no server-side plaintext data exposure.
- **Room Isolation**: Peer-to-peer room isolation via cryptographically derived keys from Room IDs.
- **CLI Commands**: Interactive terminal environment with native command support.

## Technical Architecture
- **Real-time Backend**: Firebase Realtime Database
  - **Presence System**: Automatic user cleanup on disconnect.
  - **Vote Synchronization**: Real-time consensus tracking for room deletion.
- **Security Engine**: Web Crypto API (AES-GCM)
  - **Key Derivation**: PBKDF2 with unique salts per room.
  - **Message Integrity**: Built-in authentication tags for each message.

## Installation & Setup
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/hedoescode-mayank/secure-chat.git
   cd secure-chat
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Local Development**:
   ```bash
   npm start
   ```
4. **Vercel Deployment**:
   - Push to GitHub and connect to Vercel for automatic zero-config deployment.

## Usage
- Open `index.html` in your browser.
- Share the URL with the hash (e.g., `#room=xyz`) with a peer.
- Type messages or commands directly into the terminal.

---
*chips khao maje karo ,masti naa kare jii naa kare* 🔒
