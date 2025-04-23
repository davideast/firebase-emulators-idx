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

export default async function Home() {
  return (
    <div>
      <Client authUrl={""} />
    </div>
  );
}
