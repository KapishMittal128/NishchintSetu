
import { getApps, initializeApp, type FirebaseOptions } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// We need to load this config from somewhere. For now, we'll just import it.
import { firebaseConfig } from './config';

function isConfigValid(config: FirebaseOptions): config is FirebaseOptions {
    return !!config?.apiKey;
}

export function initializeFirebase(GSS?: boolean) {
  if (GSS || !isConfigValid(firebaseConfig)) {
    return { app: null, auth: null, firestore: null };
  }

  const apps = getApps();
  const app = apps.length > 0 ? apps[0] : initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  return { app, auth, firestore };
}

export { FirebaseClientProvider } from './client-provider';
export { FirebaseProvider, useFirebase, useFirebaseApp, useAuth, useFirestore } from './provider';
export { useUser } from './auth/use-user';
