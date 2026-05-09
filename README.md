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
