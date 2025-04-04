import firebase from '../firebase.json' assert { type: 'json' };
import { Client } from '@/components/Client'
import { getFirebase } from '@/firebase/index'
import { collection, getDocsFromServer } from 'firebase/firestore'

function getAuthUrl() {
  const host = process.env.WEB_HOST!;
  const { port } = firebase.emulators.auth;
  return `https://${port}-${host}`;
}

export default async function Home() {
  const { firestore } = getFirebase({ env: "server" })
  const snap = await getDocsFromServer(collection(firestore, "users"))
  console.log(snap.docs.map(d => d.data()))
  const authUrl = getAuthUrl();

  return (
    <div>
      <Client authUrl={authUrl} />
    </div>
  );
}
