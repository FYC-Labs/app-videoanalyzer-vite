import firebase from 'firebase/compat/app';
import { getConfig } from '@src/config/config';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import 'firebase/compat/analytics';

export const firebaseConfig = getConfig('VITE_APP_FIREBASE_CONFIG');

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();

const getAuthForTenant = (tenantId) => {
  if (!tenantId) {
    auth.tenantId = 'default';
  } else {
    auth.tenantId = tenantId;
  }

  return auth;
};

const firestore = firebase.firestore();
const googleProvider = new firebase.auth.GoogleAuthProvider();
const analytics = firebase.analytics();
const now = firebase.firestore.Timestamp.now();
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
