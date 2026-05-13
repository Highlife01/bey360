// Try sign-in for both admins; create them if missing. Skip Firestore writes
// (super-admin check is client-side allowlist, doesn't need a DB role).
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAEa7XLZ7A0U42Hv622WChtHZfJqwLzbuo',
  authDomain: 'advera-c8dd0.firebaseapp.com',
  projectId: 'advera-c8dd0',
  storageBucket: 'advera-c8dd0.appspot.com',
  messagingSenderId: '929492188819',
  appId: '1:929492188819:web:e9bccbc5d76b641daed766',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const admins = [
  { email: 'cebrailkara@gmail.com', password: 'Ak010101' },
  { email: 'info@beyogluteknoloji.com', password: 'Kadir001!!' },
];

for (const a of admins) {
  try {
    const cred = await signInWithEmailAndPassword(auth, a.email, a.password);
    console.log('✅ Sign-in OK:', a.email, 'uid=', cred.user.uid);
  } catch (err) {
    console.log('Sign-in failed for', a.email, '—', err.code);
    if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
      try {
        const cred = await createUserWithEmailAndPassword(auth, a.email, a.password);
        console.log('✅ Created:', a.email, 'uid=', cred.user.uid);
      } catch (e2) {
        console.log('❌ Create failed:', a.email, '—', e2.code, e2.message);
      }
    }
  }
}
process.exit(0);
