import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyAzLuo41ZlgcPWwZiUiHRhx4dlVv0kRR8o",
  authDomain: "notemerge-c1edb.firebaseapp.com",
  projectId: "notemerge-c1edb",
  storageBucket: "notemerge-c1edb.firebasestorage.app",
  messagingSenderId: "522880771142",
  appId: "1:522880771142:web:4bfa5f47e5967563849647",
  measurementId: "G-WE5MV5PM65"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);

// Initialize Analytics (only in production and if supported)
let analytics = null;
if (process.env.NODE_ENV === 'production') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { analytics };
