export const getConfig = (key) => {
  const env = import.meta.env.VITE_APP_ENV || 'production';

  const base = {
    ENV: env,
    BACKEND_GRAPHQL_ENDPOINT: import.meta.env.VITE_APP_BASE_URL,
    VITE_APP_FIREBASE_CONFIG: {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'Missing API Key',
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'Missing Auth Domain',
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'Missing Project ID',
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'Missing Storage Bucket',
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'Missing Messaging Sender ID',
      appId: import.meta.env.VITE_FIREBASE_APP_ID || 'Missing App ID',
      measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'Missing Measurement ID',
    },
  };

  const development = {
    ...base,
  };

  const configSettings = {
    development,
  };

  const config = configSettings[env] || configSettings.development;

  if (!key) {
    return config;
  }

  return config[key];
};

export default {
  getConfig,
};
