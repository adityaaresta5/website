import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBhrRUnOl_v2J1tpNPZ1Hbpi1uebDOJqaU",
  authDomain: "website-systutor.firebaseapp.com",
  projectId: "website-systutor",
  storageBucket: "website-systutor.firebasestorage.app",
  messagingSenderId: "164815423463",
  appId: "1:164815423463:web:05cf124143ef8e17351f42",
  measurementId: "G-P7RQPBFV3M"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Aktifkan Offline Persistence agar data tetap muncul instan meskipun koneksi awal gagal/tersendat
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code == 'failed-precondition') {
    console.warn('Multiple tabs open, persistence can only be enabled in one tab at a a time.');
  } else if (err.code == 'unimplemented') {
    console.warn('The current browser does not support all of the features required to enable persistence');
  }
});

const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
