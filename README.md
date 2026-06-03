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

## WebRTC & Serverless Architecture (Recent Changes)

### Serverless WebRTC Signaling Migration
The application's backend architecture was successfully migrated from a stateful Node.js WebSocket backend (using Socket.io) to a serverless Publish-Subscribe model utilizing the **Firebase Realtime Database**. This shift was prompted by the need for deployment compatibility with serverless environments (such as Vercel), which do not support long-lived, stateful TCP WebSocket connections. 

In this serverless model:
- **State Brokerage**: Firebase acts as an ephemeral message bus for signaling. Clients register observers on database paths specific to their rooms (e.g., `rooms/{roomId}/webrtc`).
- **Pub/Sub Mechanism**: When a peer writes a signaling payload (offers, answers, ICE candidates) to the database, Firebase automatically broadcasts the update to all subscribed peers in real-time, eliminating the need for a persistent custom Node.js server.

### WebRTC Perfect Negotiation & Glare Resolution
In a peer-to-peer setup, if both users try to initiate camera sharing at the same time, their browsers will simultaneously generate session Offers. This collision is known as **WebRTC Glare** and crashes the standard WebRTC signaling state machine.

To prevent glare, SecureChat-OS implements the **Perfect Negotiation** pattern:
- **Polite & Impolite Peer Roles**: Roles are dynamically and deterministically assigned to each peer upon connecting. The assignment compares usernames alphabetically:
  ```js
  const isPolite = this.app.username.toLowerCase() < this.peerName.toLowerCase();
  ```
- **Collision Handling**: If a signaling conflict occurs, the *Polite Peer* immediately backs off, aborts its own Offer, accepts the incoming Offer, and sends a session Answer. The *Impolite Peer* ignores the collision and forces its own Offer to be processed. This resolves glare deterministically without dropping the media session.

### Late-Joiner Connection Lifecycle Mechanics
A major challenge with static, serverless WebRTC signaling is handling peers that join the room after a session has already started:
- **The Problem**: If User A is already streaming their webcam and User B joins the room later, User B misses the initial signaling offer broadcasted by User A.
- **The Solution**: We integrated a presence-triggered renegotiation loop. When User A detects a new user registration via the Firebase presence list, User A's client sends a `webrtc_request` target payload to the database.
- **State Tear-Down & Re-negotiation**: Upon receiving the request, User B (or the newly joined peer) tears down any existing peer connection state, re-allocates local media assets, and triggers a clean execution of `startNegotiation()` to negotiate a fresh session description.

### Technical Challenges & Edge Case Resolutions
Several edge cases were solved during the transition to Firebase signaling to achieve server-grade reliability:
1. **The Signaling Sync Barrier (Stale Data Filtering)**:
   - *Problem*: Because Firebase database values persist, a user joining a room could download stale signaling payloads (e.g., old offers, stale ICE candidates) written hours ago, causing the WebRTC client to fail.
   - *Resolution*: We implemented a synchronization barrier. Before listening to live database events via `.on('child_added')`, we fetch a single snapshot of all historical records in the room using `.once('value')` and set an `initialDataLoaded` flag. The live listener discards any payload received before this flag is toggled to true, filtering out all historical signaling events.
2. **Firebase Prototype Serialization Fix**:
   - *Problem*: WebRTC interfaces like `RTCSessionDescription` and `RTCIceCandidate` contain internal prototype getter methods. Firebase's database updater does not enumerate prototype getters, sending empty `{}` objects, causing the receiver to throw a `TypeError` when calling `setRemoteDescription()`.
   - *Resolution*: We explicitly call the native `.toJSON()` serialization helper on WebRTC objects before writing them to Firebase (e.g., `offer: this.pc.localDescription.toJSON()`), forcing the browser to compile properties into a plain JavaScript object.

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
The development team is committed to making SecureChat-OS the most resilient communication platform. Our upcoming major security fixes focus on three core pillars: Cryptographic Resilience, Identity Privacy, and Environment Hardening.

### 🛡️ Security Infrastructure & Philosophy
SecureChat-OS follows a "Zero Trust" model. We believe that security is not a feature but a continuous process of hardening against evolving threats.

- **Cryptographic Resilience**: 
  - **Quantum-Resistant (QR) Algorithms**: Evaluating Crystals-Kyber and Dilithium for future-proofing against Shor's algorithm.
  - **Perfect Forward Secrecy (PFS)**: Transitioning to ephemeral session keys to ensure past messages remain secure if future keys are leaked.
- **Identity Privacy**: 
  - **Zero-Knowledge Proofs (ZKP)**: Allowing users to prove room ownership without revealing the underlying Room ID or password to the database.
  - **Hardware-Level Security**: Integrating WebAuthn for FIDO2-compliant biometric and hardware security key authentication.
- **Environment Hardening**: 
  - **DevTool Detection**: Programmatic blocking of browser Developer Tools to mitigate XSS and memory scraping risks.
  - **Anti-Tampering**: Implementation of Subresource Integrity (SRI) and Content Security Policy (CSP) headers to prevent script injection.
- **Multi-Signature Purge**: Upgrading the 'Kill Room' feature to support Threshold Signature Schemes (TSS) for distributed consensus on data deletion.

> [!WARNING]
> These updates may affect users who rely on browser extensions that modify page behavior. Ensure a clean environment for optimal security.

---
![Security](https://img.shields.io/badge/Security-Post--Quantum--Pending-yellow?style=for-the-badge&logo=shield)
![Status](https://img.shields.io/badge/Status-Auditing-orange?style=for-the-badge)
![Encryption](https://img.shields.io/badge/Encryption-AES--256--GCM-green?style=for-the-badge)

*Built for absolute privacy. Secure your conversations today.* 🔒

## 🤝 Contributors
We welcome contributions from the security community. Please see our [Security Policy](SECURITY.md) for reporting vulnerabilities.

- **Mayank** (@hedoescode-mayank) - Lead Architect & Security Researcher
