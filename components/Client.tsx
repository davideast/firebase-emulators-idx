'use client';

import { useState, useEffect } from 'react'
import { getFirebase } from '@/firebase/index'
import { signInAnonymously, User, signInWithRedirect, GoogleAuthProvider, getRedirectResult } from 'firebase/auth'
import { doc, DocumentData, DocumentReference, onSnapshot, getDoc, setDoc } from 'firebase/firestore'

export function Client({ authUrl }: { authUrl: string }) {

  const { firebaseApp, auth, firestore } = getFirebase()
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<DocumentData | undefined>();

  // useEffect(() => {
  //   getRedirectResult(auth).then(result => {
  //     console.log(result);
  //   })
  // }, []);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      setUser(user);
      if(user != null) {
        const userDoc = doc(firestore, 'users', user.uid);
        console.log(userDoc.path);
        console.log('user', user.toJSON())
        setDoc(userDoc, { ...user.toJSON() })
      }
    });
    return () => unsub();
  }, [auth, user])

  useEffect(() => {
    if(!user) return;
    const userDoc = doc(firestore, 'users', user.uid);

    const unsub = onSnapshot(userDoc, (snap) => {
      setUserData({
        ...snap.data(),
      });
    });
    return () => unsub();
  }, [user, firestore])

  async function handleLogin() {
    // signInAnonymously(auth)
    signInWithRedirect(auth, new GoogleAuthProvider())
  }

  async function handleLogout() {
    auth.signOut();
  }

  console.log({ user })

  return (
    <div>
      <div>Client Component: {authUrl}</div>
      <div>
        {!user && <button onClick={handleLogin}>Login</button>}
        {user && <div>Logged in as {user.displayName}</div>}
        {user && <button onClick={handleLogout}>Logout</button>}
      </div>
      <div>
        Snapshot: {JSON.stringify(userData)}
      </div>

    </div>
  )
}