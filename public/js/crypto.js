const CryptoUtils = {
  key: null,
  salt: new TextEncoder().encode("secure-room-salt-v2"),

  async deriveKey(roomId) {
    const baseKey = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(roomId),
      "PBKDF2",
      false,
      ["deriveKey"]
    );

    this.key = await crypto.subtle.deriveKey(
      { name: "PBKDF2", salt: this.salt, iterations: 120000, hash: "SHA-256" },
      baseKey,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
    return this.key;
  },

  async encrypt(text) {
    if (!this.key) throw new Error("Key not derived");
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(text);
    const ciphertext = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      this.key,
      encoded
    );
    return {
      iv: Array.from(iv),
      data: Array.from(new Uint8Array(ciphertext))
    };
  },

  async decrypt(payload) {
    if (!this.key) throw new Error("Key not derived");
    const iv = new Uint8Array(payload.iv);
    const data = new Uint8Array(payload.data);
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      this.key,
      data
    );
    return new TextDecoder().decode(decrypted);
  }
};

window.CryptoUtils = CryptoUtils;
