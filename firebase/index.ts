import { firebaseConfig } from '@/firebase/config';
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { initializeFirestore, getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getDatabase, connectDatabaseEmulator } from 'firebase/database';

const IS_BROWSER = typeof window !== 'undefined' && typeof window.document !== 'undefined';
const IS_NODE = typeof process === 'object' && process !== null && process.versions && process.versions.node;

function replacePort(inputString: string, port: number): string {
  // ^     - Asserts position at the start of the string.
  // \d+   - Matches one or more digit characters (0-9).
  const pattern = /^\d+/;
  return inputString.replace(pattern, `${port}`);
}

export function getFirebase() {
  const firebaseApp = initializeApp(firebaseConfig);
  const auth = getAuth(firebaseApp);
  if(IS_BROWSER) {
    const host = window.location.host;
    const firestoreHost = replacePort(host, 9099);
    const firestore = initializeFirestore(firebaseApp, {
      ssl: true,
      host: firestoreHost,
      ignoreUndefinedProperties: true
    });
    
    // Uses the next.config.ts rewrites for a proxy
    // connectAuthEmulator(auth, window.location.origin);

    // Uses CORS patch?
    console.log(`${window.location.protocol}//${replacePort(host, 8080)}`);
    const authUrl = `${window.location.protocol}//${replacePort(host, 8080)}`
    connectAuthEmulator(auth, authUrl);
    // connectDatabaseEmulator(getDatabase(firebaseApp), '127.0.0.1', 9000)
    return { firebaseApp, auth, firestore };
  } else {
    const firestore = getFirestore(firebaseApp);
    connectAuthEmulator(getAuth(firebaseApp), 'http://127.0.0.1:8080');
    connectFirestoreEmulator(getFirestore(firebaseApp), '127.0.0.1', 9099);
    return { firebaseApp, auth, firestore };
  }
}
