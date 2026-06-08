# SecureChat-OS v2.0.0

<p align="center">
  <img src="https://img.shields.io/badge/Encryption-AES--256--GCM-00ff41?style=for-the-badge&logo=gnuprivacyguard&logoColor=white" />
  <img src="https://img.shields.io/badge/Backend-Firebase%20Realtime%20DB-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" />
  <img src="https://img.shields.io/badge/Video-WebRTC%20P2P-3e8eff?style=for-the-badge&logo=webrtc&logoColor=white" />
  <img src="https://img.shields.io/badge/Deploy-Vercel-000?style=for-the-badge&logo=vercel&logoColor=white" />
  <img src="https://img.shields.io/badge/Security-Post--Quantum--Pending-yellow?style=for-the-badge&logo=shield" />
</p>

<p align="center">
  <b>A professional-grade, terminal-themed encrypted chat application with peer-to-peer video streaming.</b><br/>
  Built on Firebase Realtime Database · AES-GCM 256-bit E2EE · WebRTC with TURN relay · Serverless-first architecture
</p>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technical Architecture](#technical-architecture)
- [End-to-End Encryption](#end-to-end-encryption)
- [WebRTC Video Streaming](#webrtc-video-streaming)
- [Serverless Migration](#serverless-migration)
- [Edge Cases & Hard Problems Solved](#edge-cases--hard-problems-solved)
- [Installation & Setup](#installation--setup)
- [Usage Guide](#usage-guide)
- [Deployment](#deployment)
- [Future Roadmap](#future-roadmap)
- [Contributors](#contributors)

---

## Overview

SecureChat-OS is a zero-trust, browser-based encrypted communication platform disguised as a retro CLI terminal. It provides two core capabilities:

1. **End-to-End Encrypted Text Chat** — Messages are encrypted client-side using AES-256-GCM before touching any server. Firebase only ever sees ciphertext.
2. **Peer-to-Peer Video Streaming** — Direct WebRTC connections between browsers with no media relay through a central server (with TURN fallback for restrictive NATs).

The entire application runs as a single `index.html` with inline CSS/JS — no build step, no bundler, no framework. The backend is fully serverless via Firebase Realtime Database.

---

## Features

### 🖥️ Terminal UI
- Premium hacker-aesthetic with CRT scanline effects and fluid animations
- Fira Code monospace font with green-on-black terminal styling
- Interactive CLI command system (`/clear`, `/delete`, `/info`, `/help`)
- Responsive layout with mobile viewport fixes (`position: fixed` strategy)

### 🔐 End-to-End Encryption
- **AES-256-GCM** symmetric encryption via the native Web Crypto API
- **PBKDF2** key derivation (100,000 iterations, SHA-256) from Room ID
- Unique random 12-byte IV per message — no IV reuse
- Built-in authentication tags for message integrity verification
- Zero plaintext exposure on any server or database

### 📹 WebRTC Video (Peek Here)
- Peer-to-peer video streaming — no media server required
- **Perfect Negotiation** pattern for glare-free session setup
- Multi-camera source selection with live device switching
- Draggable floating video widget with resizable viewport
- Picture-in-picture layout: local feed thumbnail over remote stream
- TURN relay fallback via Metered OpenRelay for carrier-grade NAT traversal

### 💀 Kill Room (Consensus Deletion)
- Multi-user agreement protocol to purge all room data
- Real-time vote synchronization via Firebase
- Full data destruction: messages, presence, WebRTC signaling payloads

### 👥 Presence System
- Automatic user registration and cleanup on disconnect
- Firebase `onDisconnect()` hooks for reliable presence tracking
- Late-joiner detection triggers WebRTC renegotiation

---

## Technical Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (Client)                     │
│                                                         │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │ Terminal  │  │  CryptoUtils │  │  CameraWidget     │  │
│  │ Engine    │  │  (AES-GCM)   │  │  (WebRTC + TURN)  │  │
│  └────┬─────┘  └──────┬───────┘  └────────┬──────────┘  │
│       │               │                   │              │
│       └───────────────┼───────────────────┘              │
│                       │                                  │
│              ┌────────▼────────┐                         │
│              │   SecureChat    │                         │
│              │   (App Core)    │                         │
│              └────────┬────────┘                         │
└───────────────────────┼─────────────────────────────────┘
                        │ Firebase SDK (Compat)
                        ▼
         ┌──────────────────────────────┐
         │   Firebase Realtime Database │
         │                              │
         │  rooms/{roomId}/             │
         │    ├── messages/             │
         │    ├── presence/             │
         │    ├── webrtc/               │
         │    └── votes/                │
         └──────────────────────────────┘
```

### Core Components

| Component | Responsibility |
|-----------|---------------|
| **`Terminal`** | Manages the CLI output buffer, boot sequence, line rendering |
| **`CryptoUtils`** | PBKDF2 key derivation + AES-GCM encrypt/decrypt |
| **`CameraWidget`** | WebRTC lifecycle, TURN config, video UI, device management |
| **`SecureChat`** | App orchestrator — Firebase bindings, presence, message routing |

### Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vanilla HTML/CSS/JS (single file) |
| Font | Fira Code (Google Fonts) |
| Database | Firebase Realtime Database |
| Encryption | Web Crypto API (AES-256-GCM + PBKDF2) |
| Video | WebRTC + Metered OpenRelay TURN |
| Hosting | Vercel (serverless) |
| Analytics | Vercel Web Analytics |

---

## End-to-End Encryption

### Key Derivation (PBKDF2)

Both peers independently derive the **same symmetric key** from the Room ID — no key exchange over the network.

```
Room ID → PBKDF2(SHA-256, 100k iterations, static salt) → AES-256 Key
```

### Message Encryption (AES-GCM)

```
Plaintext + Random IV + Derived Key → AES-GCM → { ciphertext (Base64), iv (Base64) }
```

- Every message gets a **unique 12-byte IV** via `crypto.getRandomValues()`
- GCM mode provides both confidentiality and authenticity (built-in auth tag)
- Firebase stores only `{ data: "...", iv: "..." }` — pure ciphertext

### Why This Works

Anyone with the Room URL can derive the key. The security model assumes the Room ID (URL) is shared through a trusted side-channel (in-person, encrypted messenger, etc.).

---

## WebRTC Video Streaming

### Signaling via Firebase

WebRTC requires a signaling channel to exchange session metadata before a direct peer connection can be established. We use Firebase Realtime Database as a serverless signaling server:

```
rooms/{roomId}/webrtc/ ← Signaling payloads (offers, answers, ICE candidates)
```

Clients subscribe to this path via `.on('child_added')` and react to incoming signaling messages in real-time.

### Perfect Negotiation (Glare Resolution)

When both peers initiate video simultaneously, their Offers collide (**WebRTC Glare**). We resolve this deterministically:

```js
// Role assignment: alphabetical username comparison
const isPolite = this.app.username.toLowerCase() < this.peerName.toLowerCase();
```

- **Polite Peer**: Backs off on collision — aborts own Offer, accepts incoming, sends Answer
- **Impolite Peer**: Ignores the collision — forces its own Offer through

### Late-Joiner Renegotiation

If User B joins after User A is already streaming:

1. User A detects User B via Firebase presence list change
2. User A sends a `webrtc_request` signal
3. User B tears down any stale state, re-initializes `RTCPeerConnection`
4. Fresh `startNegotiation()` creates a new Offer for User B

### ICE / TURN Configuration

We use 14 ICE servers for maximum connectivity:

| Type | Provider | Purpose |
|------|----------|---------|
| STUN | Google (`stun.l.google.com`) | NAT discovery (5 servers) |
| STUN | Metered (`stun.relay.metered.ca`) | Backup STUN |
| TURN | Metered OpenRelay (UDP/TCP/TLS) | NAT traversal relay (8 servers) |

TURN servers are **critical** for mobile devices behind carrier-grade NAT where STUN alone cannot establish a direct connection.

---

## Serverless Migration

### The Problem

The original backend used **Socket.io** on a stateful Node.js server. Vercel's serverless functions (AWS Lambda) don't support persistent WebSocket connections — they spin up per-request and die immediately.

### The Solution

Firebase Realtime Database acts as an **ephemeral Pub/Sub message bus**:

- Clients subscribe to database paths (`rooms/{roomId}/messages`)
- Firebase broadcasts mutations to all subscribers in real-time
- No custom server process needed — fully serverless

The Express server (`server.js`) now only serves static files for local development. In production on Vercel, it's not used at all.

---

## Edge Cases & Hard Problems Solved

### 1. Stale Signaling Data (The Sync Barrier)

**Problem**: Firebase persists data. A late joiner downloads old WebRTC offers from hours ago, crashing the signaling state machine.

**Fix**: Fetch a snapshot via `.once('value')` before attaching the live `.on('child_added')` listener. Set an `initialDataLoaded` flag — all messages arriving before the flag is `true` are silently discarded.

### 2. Firebase Prototype Serialization Bug

**Problem**: `RTCSessionDescription` and `RTCIceCandidate` use prototype getters for their properties. Firebase's serializer ignores prototype getters, sending empty `{}` objects to peers.

**Fix**: Explicitly call `.toJSON()` on WebRTC objects before writing to Firebase:
```js
offer: this.pc.localDescription.toJSON()
```

### 3. Mobile Video Black Screen (Android/iOS)

**Problem**: Remote video renders as a black rectangle on mobile browsers due to autoplay restrictions and srcObject timing issues.

**Fixes applied**:
- Force `muted` + `playsinline` attributes on remote video element
- Re-assign `srcObject` after connection state reaches `"connected"`
- Multiple `play()` retry attempts with staggered timeouts (0ms, 300ms, 1000ms)
- Listen to both `onloadedmetadata` and `track.onunmute` events

### 4. Mobile Viewport Cutoff

**Problem**: `100vh` on mobile browsers includes the URL bar height, cutting off the bottom input.

**Fix**: Replace `height: 100vh` with `position: fixed; inset: 0;` for true full-viewport layout.

### 5. Hardware Resource Leaks

**Problem**: Rapidly toggling the camera creates orphaned `RTCPeerConnection` instances that hold camera locks and leak memory.

**Fix**: Strict `closePeerConnection()` lifecycle — null all event handlers, `track.stop()` all media tracks, `pc.close()` the connection, then null the reference.

---

## Installation & Setup

### Prerequisites
- Node.js 18+ (for local development server)
- A modern browser with Web Crypto API support

### Quick Start

```bash
# Clone the repository
git clone https://github.com/hedoescode-mayank/secure-chat-ws.git
cd secure-chat-ws

# Install dependencies
npm install

# Start the development server
npm start
# → http://localhost:3000
```

### Local Development

```bash
npm run dev    # Node.js --watch mode for auto-restart
```

---

## Usage Guide

### Joining a Room

Open the app URL with a room hash:
```
https://secure-chat.vercel.app/#room=your-secret-room-name
```

The Room ID in the hash determines the encryption key. **Both peers must use the exact same URL.**

### Terminal Commands

| Command | Description |
|---------|-------------|
| `/clear` | Wipe the terminal screen |
| `/delete` | Initiate a room purge (requires 2-user consensus) |
| `/info` | Display session metadata and security info |
| `/help` | List all available commands |

### Video Streaming

1. Click **PEEK HERE** in the header to open the camera widget
2. Select a camera source from the dropdown
3. Click **[CAM ON]** to start streaming
4. Your peer will automatically receive the stream via WebRTC
5. Drag the widget and local video thumbnail freely around the screen
6. Use **[SIZE +]** / **[SIZE -]** to resize the widget

---

## Deployment

### Vercel (Recommended)

Push to GitHub — Vercel auto-deploys via the connected repository. Configuration is handled by `vercel.json`:
- All routes serve `index.html` (SPA behavior)
- Static files served from `/public`

### Render

A `render.yaml` is included for one-click deployment to Render as a Node.js web service.

### Docker

```bash
docker build -t securechat .
docker run -p 3000:3000 securechat
```

---

## Future Roadmap

### 🛡️ Security Hardening

| Initiative | Description |
|-----------|-------------|
| **Quantum-Resistant Crypto** | Evaluating Crystals-Kyber and Dilithium for post-quantum key exchange |
| **Perfect Forward Secrecy** | Ephemeral session keys to protect past messages if future keys leak |
| **Zero-Knowledge Proofs** | Prove room ownership without revealing the Room ID to the database |
| **WebAuthn / FIDO2** | Hardware security key and biometric authentication |
| **DevTool Detection** | Programmatic blocking of browser DevTools to mitigate XSS risks |
| **SRI + CSP Headers** | Subresource Integrity and Content Security Policy for anti-tampering |
| **Threshold Signatures** | Upgrade Kill Room to use TSS for distributed consensus on deletion |

> [!WARNING]
> Future security updates may affect users who rely on browser extensions that modify page behavior. Ensure a clean browser environment for optimal security.

---

## Contributors

We welcome contributions from the security community. Please see our [Security Policy](SECURITY.md) for reporting vulnerabilities.

- **Mayank** ([@hedoescode-mayank](https://github.com/hedoescode-mayank)) — Lead Architect & Security Researcher

---

<p align="center">
  <i>Built for absolute privacy. Secure your conversations today.</i> 🔒
</p>
