import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAEa7XLZ7A0U42Hv622WChtHZfJqwLzbuo',
  authDomain: 'advera-c8dd0.firebaseapp.com',
  projectId: 'advera-c8dd0',
  storageBucket: 'advera-c8dd0.firebasestorage.app',
  messagingSenderId: '929492188819',
  appId: '1:929492188819:web:e9bccbc5d76b641daed766',
  measurementId: 'G-V788HEM892',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});
export const db = getFirestore(app);
