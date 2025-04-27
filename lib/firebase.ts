import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCReQz23LPT1mw5poZLUbFRXbePZPMutlA",
  authDomain: "react-firebase-7ab51.firebaseapp.com",
  projectId: "react-firebase-7ab51",
  storageBucket: "react-firebase-7ab51.appspot.com",
  messagingSenderId: "925095151775",
  appId: "1:925095151775:web:b52d80037dd9dc65493aaa",
  measurementId: "G-0E2GVCJTJ9"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Only initialize analytics in production
const analytics = typeof window !== 'undefined' && process.env.NODE_ENV === 'production' 
  ? getAnalytics(app) 
  : null;

// Add error handling for blocked requests
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    if (event.error?.message?.includes('ERR_BLOCKED_BY_CLIENT')) {
      console.warn(
        'Firebase request was blocked by a browser extension. ' +
        'Please disable ad blockers or privacy extensions for localhost:3000'
      );
    }
  });
}

export { app, auth, db, storage, analytics }; 