'use client';

import { useState, useEffect } from 'react'
import { getFirebase } from '@/firebase/index'
import { signInAnonymously, User } from 'firebase/auth'
import { doc, DocumentData, DocumentReference, onSnapshot, getDoc, setDoc } from 'firebase/firestore'

export function Client({ authUrl }: { authUrl: string }) {

  const { firebaseApp, auth, firestore } = getFirebase({ env: "browser" })
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<DocumentData | undefined>();

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      setUser(user);
      if(user != null) {
        const userDoc = doc(firestore, 'users', user.uid);
        console.log(userDoc.path);
        setDoc(userDoc, { uid: user.uid })
      }
    });
    return () => unsub();
  }, [auth, user])

  // useEffect(() => {
  //   if(!user) return;
  //   const userDoc = doc(firestore, 'users', user.uid);

  //   const unsub = onSnapshot(userDoc, (snap) => {
  //     setUserData({
  //       ...snap.metadata,
  //       ...snap.data(),
  //     });
  //   });
  //   return () => unsub();
  // }, [user, firestore])

  useEffect(() => {
    if(!user) return;
    const userDoc = doc(firestore, 'users', user.uid);
    getDoc(userDoc).then(snap => {
      setUserData({
        ...snap.metadata,
        ...snap.data(),
      });
    })
  }, [user, firestore])

  async function handleLogin() {
    signInAnonymously(auth)
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
        {user && <div>Logged in as {user.uid}</div>}
        {user && <button onClick={handleLogout}>Logout</button>}
      </div>
      <div>
        Snapshot: {JSON.stringify(userData)}
      </div>

    </div>
  )
}