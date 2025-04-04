import { firebaseConfig } from '@/firebase/config';
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { initializeFirestore, getFirestore, connectFirestoreEmulator } from 'firebase/firestore'

function replacePort(inputString: string, port: number): string {
  // ^     - Asserts position at the start of the string.
  // \d+   - Matches one or more digit characters (0-9).
  const pattern = /^\d+/;
  return inputString.replace(pattern, `${port}`);
}

export function getFirebase({ env } = { env: "browser"}) {
  const firebaseApp = initializeApp(firebaseConfig);
  const auth = getAuth(firebaseApp);
  if(env === "browser") {
    const host = window.location.host;
    const firestoreHost = replacePort(host, 8080);
    const firestore = initializeFirestore(firebaseApp, {
      ssl: true,
      host: firestoreHost,
      ignoreUndefinedProperties: true
    });
    connectAuthEmulator(auth, window.location.origin);
    return { firebaseApp, auth, firestore };
  } else {
    const firestore = getFirestore(firebaseApp);
    connectAuthEmulator(getAuth(firebaseApp), 'http://127.0.0.1:9099');
    connectFirestoreEmulator(getFirestore(firebaseApp), '127.0.0.1', 8080);
    return { firebaseApp, auth, firestore };
  }
}
