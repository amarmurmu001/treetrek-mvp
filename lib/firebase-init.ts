import { app, auth, db, storage, analytics } from './firebase';
import { enableIndexedDbPersistence, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import { browserLocalPersistence, setPersistence } from 'firebase/auth';

// Initialize Firestore with persistence
if (typeof window !== 'undefined') {
  initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    })
  });

  // Enable offline persistence
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.warn('The current browser does not support persistence.');
    }
  });
}

// Configure Firebase Auth persistence
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error('Error setting auth persistence:', error);
});

export { app, auth, db, storage, analytics }; 