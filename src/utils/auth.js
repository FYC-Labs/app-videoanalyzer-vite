import 'firebase/compat/auth';
import firebase from 'firebase/compat/app';
import { $auth, $global, $user } from '@src/signals';
import { getAuthForTenant } from '@src/utils/firebase';
import UsersApi from '@src/api/users.api';

const tenantId = import.meta.env.VITE_APP_FIREBASE_TENANT_ID;
const auth = getAuthForTenant(tenantId);

export const signIn = async (email, password) => {
  // await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
  await auth.signInWithEmailAndPassword(email, password);
};

export const signInWithGoogle = async () => {
  const googleProvider = new firebase.auth.GoogleAuthProvider();
  await auth.signInWithPopup(googleProvider);
};

export const signOut = async () => {
  await auth.signOut();
};

export const createNewUser = async (email, password) => {
  const res = await auth.createUserWithEmailAndPassword(email, password);
  await res.user.sendEmailVerification();
  return res.user;
};

export const sendPasswordResetEmail = async (email) => {
  await auth.sendPasswordResetEmail(email);
};

export const getFirebaseToken = async () => {
  if (firebase.auth().currentUser) {
    return firebase.auth().currentUser.getIdToken();
  }
  return null;
};

export const currentUser = async () => firebase.auth().currentUser;

const parseSessionPayloadFromUser = (payload) => ({
  authToken: payload.multiFactor.user.accessToken,
});

export const handleFirebaseLogin = async (fbUser) => {
  const { authToken } = parseSessionPayloadFromUser(fbUser);
  if (authToken) {
    $auth.update({ authToken });

    $global.update({
      isSignedIn: true,
    });
  }
};

export const getCurrentAuthenticatedUser = async () => {
  const authToken = await getFirebaseToken();
  let user;

  if (authToken) {
    user = await UsersApi.getFullUserWithToken();
    $user.update(user[0]);
  }
  return user[0];
};

export const handleFirebaseLogout = (setAlert) => {
  auth.signOut();
  $auth.reset();
  $global.reset();
  $user.reset();
  setAlert({
    message: 'Logged Out!',
    variant: 'success',
  });
};
