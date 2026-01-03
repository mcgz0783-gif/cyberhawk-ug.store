// Lightweight Firebase initialization module.
// Put your Firebase credentials into environment variables and DO NOT commit them.
// Common env var names shown below; adapt to your build system:
// - Create React App: REACT_APP_FIREBASE_API_KEY etc.
// - Vite: VITE_FIREBASE_API_KEY etc.

// Example env keys used here (order: REACT_APP_* -> VITE_* -> fallback placeholder)
const firebaseConfig = {
  apiKey:
    process.env.REACT_APP_FIREBASE_API_KEY ||
    (typeof import.meta !== "undefined" ? (import.meta as any).env.VITE_FIREBASE_API_KEY : undefined) ||
    "YOUR_API_KEY",
  authDomain:
    process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ||
    (typeof import.meta !== "undefined" ? (import.meta as any).env.VITE_FIREBASE_AUTH_DOMAIN : undefined) ||
    "YOUR_PROJECT.firebaseapp.com",
  projectId:
    process.env.REACT_APP_FIREBASE_PROJECT_ID ||
    (typeof import.meta !== "undefined" ? (import.meta as any).env.VITE_FIREBASE_PROJECT_ID : undefined) ||
    "YOUR_PROJECT_ID",
  storageBucket:
    process.env.REACT_APP_FIREBASE_STORAGE_BUCKET ||
    (typeof import.meta !== "undefined" ? (import.meta as any).env.VITE_FIREBASE_STORAGE_BUCKET : undefined) ||
    "YOUR_PROJECT.appspot.com",
  messagingSenderId:
    process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID ||
    (typeof import.meta !== "undefined" ? (import.meta as any).env.VITE_FIREBASE_MESSAGING_SENDER_ID : undefined) ||
    "XXXX",
  appId:
    process.env.REACT_APP_FIREBASE_APP_ID ||
    (typeof import.meta !== "undefined" ? (import.meta as any).env.VITE_FIREBASE_APP_ID : undefined) ||
    "XXXX",
};

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
