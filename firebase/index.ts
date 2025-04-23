import { firebaseConfig } from '@/firebase/config';
import { getApps, initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { initializeFirestore, getFirestore, connectFirestoreEmulator } from 'firebase/firestore'

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
    const firestoreHost = host;
    console.log({ firestoreHost: host })
    const firestore = initializeFirestore(firebaseApp, {
      ssl: true,
      host: firestoreHost,
      ignoreUndefinedProperties: true,
      // experimentalForceLongPolling: true,
    });
    // connectFirestoreEmulator(firestore, window.location.host, 443)
    connectAuthEmulator(auth, window.location.origin);
    const services = getEnvironment()
    console.log(services);
    return { firebaseApp, auth, firestore };
  } else {
    const firestore = initializeFirestore(firebaseApp, {
      ignoreUndefinedProperties: true,
      experimentalForceLongPolling: true,
    });
    connectAuthEmulator(getAuth(firebaseApp), 'http://127.0.0.1:9099');
    connectFirestoreEmulator(getFirestore(firebaseApp), '127.0.0.1', 8080);
    return { firebaseApp, auth, firestore };
  }
}

export function getEnvironment() {
  const app = getApps().at(0) as any;
  const services = new Map<string, any>();
  const providerList = ["auth", "firestore"];
  const providerConfig: Record<string, any> = {
    "auth": { instanceName: "[DEFAULT]", settings: 'emulatorConfig' },
    "firestore": { instanceName: "(default)", settings: "_settings" },
  }
  for(let [providerKey, provider] of app._container.providers.entries()) {
    if(providerList.includes(providerKey)) {
      const instance = provider.instances.get(providerConfig[providerKey].instanceName);
      const settingsKey = providerConfig[providerKey].settings;
      const host = instance[settingsKey].host;
      console.log({ host })
      const isEmulator = host?.includes('cloudworkstations.dev');
      const environment = isEmulator ? 'emulator' : 'production';
      services.set(providerKey, {
        instance,
        environment,
      })
    }
  }
  return services;
}
