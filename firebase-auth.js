import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithPopup,
  signOut,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

const FIREBASE_CONFIG = {
  apiKey: 'YOUR_FIREBASE_API_KEY',
  authDomain: 'YOUR_PROJECT.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  appId: 'YOUR_APP_ID',
};

export const ADMIN_EMAIL = 'your-admin@gmail.com';

const configured = !Object.values(FIREBASE_CONFIG).some((value) => value.startsWith('YOUR_'));

let auth;
let provider;

if (configured) {
  const app = initializeApp(FIREBASE_CONFIG);
  auth = getAuth(app);
  provider = new GoogleAuthProvider();
}

export function isFirebaseConfigured() {
  return configured;
}

export function listenForAuthChanges(callback) {
  if (!configured) {
    callback(null);
    return () => {};
  }

  return onAuthStateChanged(auth, callback);
}

export function isAuthorizedAdmin(user) {
  return Boolean(user?.email && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase());
}

export async function signInWithGoogle() {
  if (!configured) {
    throw new Error('Firebase is not configured yet.');
  }

  const result = await signInWithPopup(auth, provider);
  return result.user;
}

export async function logout() {
  if (!configured) {
    return;
  }

  await signOut(auth);
}

export async function sendResetLink(email) {
  if (!configured) {
    throw new Error('Firebase is not configured yet.');
  }

  await sendPasswordResetEmail(auth, email);
}
