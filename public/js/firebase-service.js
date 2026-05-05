// Firebase Configuration - PASTE YOUR CONFIG HERE
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

class FirebaseService {
  constructor() {
    this.roomId = null;
    this.onMessageCallback = null;
    this.onSystemCallback = null;
    this.onNickUpdateCallback = null;
    this.onDeleteCallback = null;
  }

  setRoom(roomId) {
    this.roomId = roomId;
    this.listenForMessages();
    this.listenForNicks();
    this.listenForDelete();
  }

  listenForMessages() {
    const messagesRef = db.ref(`rooms/${this.roomId}/messages`);
    // Only listen for new messages (starting from now)
    const startTime = Date.now();
    messagesRef.orderByChild("timestamp").startAt(startTime).on("child_added", (snapshot) => {
      const msg = snapshot.val();
      if (this.onMessageCallback && msg.type === "chat") {
        this.onMessageCallback(msg);
      }
    });
  }

  listenForNicks() {
    db.ref(`rooms/${this.roomId}/nicks`).on("child_added", (snapshot) => {
      const data = snapshot.val();
      if (this.onNickUpdateCallback) {
        this.onNickUpdateCallback(data);
      }
    });
  }

  listenForDelete() {
    db.ref(`rooms/${this.roomId}/delete`).on("value", (snapshot) => {
      const data = snapshot.val();
      if (data && data.status === "confirmed" && this.onDeleteCallback) {
        this.onDeleteCallback();
      }
    });
  }

  send(type, payload) {
    const timestamp = Date.now();
    if (type === "chat") {
      db.ref(`rooms/${this.roomId}/messages`).push({
        type: "chat",
        ...payload,
        timestamp
      });
    } else if (type === "join" || type === "nick_update") {
      db.ref(`rooms/${this.roomId}/nicks`).push({
        type: "nick_update",
        ...payload,
        timestamp
      });
    } else if (type === "delete_request") {
      db.ref(`rooms/${this.roomId}/messages`).push({
        type: "delete_request",
        timestamp
      });
    } else if (type === "delete_confirm") {
      db.ref(`rooms/${this.roomId}/delete`).set({
        status: "confirmed",
        timestamp
      });
    }
  }

  // Cleanup room data after a delay if needed (optional)
  clearRoom() {
    db.ref(`rooms/${this.roomId}`).remove();
  }
}

window.FirebaseService = FirebaseService;
