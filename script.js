import { initializeApp } from
"https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
  getDatabase,
  ref,
  set,
  get,
  onValue
} from
"https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "TWÓJ_API_KEY",
  authDomain: "pandixif-multiplayer.firebaseapp.com",
  databaseURL: "https://pandixif-multiplayer-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "pandixif-multiplayer",
  storageBucket: "pandixif-multiplayer.firebasestorage.app",
  messagingSenderId: "226124925060",
  appId: "1:226124925060:web:c414a82236e554deb7dad1"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
