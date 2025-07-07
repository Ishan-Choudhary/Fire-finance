// Import the functions you need from the SDKs you need
import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signInAnonymously, signOut, deleteUser, type Auth, type User } from "firebase/auth"
import { getDatabase, set, get, ref, remove, onValue, type Database } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  databaseURL: import.meta.env.VITE_DATABASE_URL
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const database: Database = getDatabase(app);

export {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signInAnonymously,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  deleteUser,
  type User,
  type Auth,

  database,
  set,
  get,
  onValue,
  remove,
  ref,
}
