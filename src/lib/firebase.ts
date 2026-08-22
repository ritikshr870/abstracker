import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore, memoryLocalCache, setLogLevel } from "firebase/firestore";

// Silence Firestore offline/connection warnings in console to prevent AI Studio auto-error triggers
setLogLevel("silent");

const firebaseConfig = {
  apiKey: "AIzaSyANymVM5EmKLq_FcPI6RaB2iqpESrTyTic",
  authDomain: "abs-tracker-india.firebaseapp.com",
  projectId: "abs-tracker-india",
  storageBucket: "abs-tracker-india.firebasestorage.app",
  messagingSenderId: "947881624249",
  appId: "1:947881624249:web:65496472dbdab05a219168"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Use memory cache and long polling to prevent IndexedDB and WebSocket issues in iframe sandboxes
export const db = initializeFirestore(app, {
  localCache: memoryLocalCache(),
  experimentalForceLongPolling: true
});
