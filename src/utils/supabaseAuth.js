import { supabase } from './supabaseClient';
import { $auth, $global, $user } from '@src/signals';

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;

  return data;
};

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin
    }
  });

  if (error) throw error;

  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const createNewUser = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: window.location.origin
    }
  });

  if (error) throw error;

  return data.user;
};

export const sendPasswordResetEmail = async (email) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`
  });

  if (error) throw error;
};

export const getSupabaseToken = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
};

export const currentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

export const handleSupabaseLogin = async (session) => {
  if (session?.access_token) {
    $auth.update({ authToken: session.access_token });

    $global.update({
      isSignedIn: true,
    });

    const user = session.user;
    if (user) {
      $user.update({
        id: user.id,
        email: user.email,
        ...user.user_metadata
      });
    }
  }
};

export const handleSupabaseLogout = async (setAlert) => {
  await signOut();
  $auth.reset();
  $global.reset();
  $user.reset();

  if (setAlert) {
    setAlert({
      message: 'Logged Out!',
      variant: 'success',
    });
  }
};

export const initAuthListener = (onAuthChange) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session) {
      handleSupabaseLogin(session);
    } else if (event === 'SIGNED_OUT') {
      $auth.reset();
      $global.reset();
      $user.reset();
    }

    if (onAuthChange) {
      onAuthChange(event, session);
    }
  });

  return subscription;
};
