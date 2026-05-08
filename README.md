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

## Usage Guide
- **Accessing Rooms**: Open the application URL with a room hash (e.g., `https://secure-chat.vercel.app/#room=secret-tunnel`).
- **Encryption Key**: The encryption key is derived directly from the Room ID. Ensure your peer has the exact same link.
- **Terminal Commands**:
  - `/clear`: Wipes the terminal screen.
  - `/delete`: Instigates a room purge (requires 2-user consensus).
  - `/info`: Displays current session and security metadata.
  - `/help`: Lists all available system commands.

## Future Roadmap & Security Updates
The development team is actively working on enhancing the security posture of SecureChat-OS. Upcoming versions will introduce stricter client-side protection:
- **Anti-Tamper Measures**: Access to browser Developer Tools (F12, Inspect Element) will be restricted to prevent unauthorized script injection and memory inspection.



---
![Security](https://img.shields.io/badge/Security-AES--256--GCM-green?style=for-the-badge&logo=shield)
![Status](https://img.shields.io/badge/Status-Verified-blue?style=for-the-badge)

*chips khao maje karo ,masti naa kare jii naa kare* 🔒
