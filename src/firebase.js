import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDpJJc7Nr83E0Zqs-C_1BPzIJ6zG-pxQdc",
  authDomain: "readtrack-5cf3f.firebaseapp.com",
  projectId: "readtrack-5cf3f",
  storageBucket: "readtrack-5cf3f.firebasestorage.app",
  messagingSenderId: "491470039662",
  appId: "1:491470039662:web:57ed97754936b1be12147f",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;