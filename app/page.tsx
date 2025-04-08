import firebase from '../firebase.json' assert { type: 'json' };
import { Client } from '@/components/Client'
import { getFirebase } from '@/firebase/index'
import { collection, getDocsFromServer } from 'firebase/firestore'
import { initializeApp, getApps } from 'firebase-admin/app'
import { getAuth, UserIdentifier, UidIdentifier } from 'firebase-admin/auth'

function getAuthUrl() {
  const host = process.env.WEB_HOST!;
  const { port } = firebase.emulators.auth;
  return `https://${port}-${host}`;
}

const adminApp = getApps().at(0) != null ? getApps().at(0) : initializeApp();
const adminAuth = getAuth(adminApp);

export default async function Home() {
  const { firestore } = getFirebase()
  const users = await adminAuth.listUsers();
  console.log(users.users.map(u => u.uid));
  const snap = await getDocsFromServer(collection(firestore, "users"))
  console.log(snap.docs.map(d => d.data()))
  const authUrl = getAuthUrl();

  return (
    <div>
      <Client authUrl={authUrl} />
    </div>
  );
}
