// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBY-11NxEjWDYwj4H7Rc4nCFQSYLAYqFpc",
  authDomain: "xhacks-546a0.firebaseapp.com",
  projectId: "xhacks-546a0",
  storageBucket: "xhacks-546a0.firebasestorage.app",
  messagingSenderId: "293961097778",
  appId: "1:293961097778:web:8335842b8af33326ba522b",
  measurementId: "G-XEYQ5C395F"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
