import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const firebaseReady = Boolean(
  config.apiKey && config.authDomain && config.databaseURL && config.projectId && config.appId
);

let app = null;
let database = null;

if (firebaseReady) {
  app = getApps().length ? getApps()[0] : initializeApp(config);
  database = getDatabase(app);
}

export { app, database };
