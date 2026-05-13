import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { ensureUserDashboard } from './userService';

export async function signInWithGoogle() {
  const credential = await signInWithPopup(auth, googleProvider);
  await ensureUserDashboard(credential.user.uid, credential.user.email ?? '');
  return credential.user;
}
