import firebase from 'firebase/compat/app';
import { getConfig } from '@src/config/config';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import 'firebase/compat/analytics';

export const firebaseConfig = getConfig('VITE_APP_FIREBASE_CONFIG');

// Validate Firebase config before initializing
const isFirebaseConfigValid = firebaseConfig && 
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== 'Missing API Key' &&
  firebaseConfig.projectId && 
  firebaseConfig.projectId !== 'Missing Project ID';

if (!firebase.apps.length && isFirebaseConfigValid) {
  firebase.initializeApp(firebaseConfig);
} else if (!isFirebaseConfigValid) {
  console.warn('Firebase configuration is missing or invalid. Please set the following environment variables:');
  console.warn('- VITE_FIREBASE_API_KEY');
  console.warn('- VITE_FIREBASE_AUTH_DOMAIN');
  console.warn('- VITE_FIREBASE_PROJECT_ID');
  console.warn('- VITE_FIREBASE_STORAGE_BUCKET');
  console.warn('- VITE_FIREBASE_MESSAGING_SENDER_ID');
  console.warn('- VITE_FIREBASE_APP_ID');
  console.warn('- VITE_FIREBASE_MEASUREMENT_ID');
}

// Only initialize Firebase services if Firebase is properly configured
const auth = isFirebaseConfigValid && firebase.apps.length > 0 ? firebase.auth() : null;

const getAuthForTenant = (tenantId) => {
  if (!auth) {
    throw new Error('Firebase is not initialized. Please configure Firebase environment variables.');
  }
  if (!tenantId) {
    auth.tenantId = 'default';
  } else {
    auth.tenantId = tenantId;
  }

  return auth;
};

const firestore = isFirebaseConfigValid && firebase.apps.length > 0 ? firebase.firestore() : null;
const googleProvider = isFirebaseConfigValid && firebase.apps.length > 0 ? new firebase.auth.GoogleAuthProvider() : null;
const analytics = isFirebaseConfigValid && firebase.apps.length > 0 ? firebase.analytics() : null;
const now = isFirebaseConfigValid && firebase.apps.length > 0 && firestore ? firebase.firestore.Timestamp.now() : null;
const fbKey = `firebase:authUser:${getConfig('VITE_APP_FIREBASE_PUB_KEY')}:[DEFAULT]`;

const getLocalStorage = () => Object.keys(window.localStorage)
  .filter((item) => item.startsWith('firebase:authUser'))[0];

export {
  auth,
  firestore,
  googleProvider,
  now,
  getLocalStorage,
  fbKey,
  analytics,
  getAuthForTenant,
};
