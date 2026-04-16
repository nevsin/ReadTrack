import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

const readingSessionsCollectionRef = collection(db, "readingSessions");

export const getReadingSessions = async () => {
  const q = query(readingSessionsCollectionRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docItem) => {
    const data = docItem.data();

    return {
      id: docItem.id,
      bookTitle: data.bookTitle || "",
      duration: data.duration || 0,
      date: data.date || "Recently",
      createdAt: data.createdAt || null,
    };
  });
};

export const addReadingSession = async (session) => {
  const newSession = {
    bookTitle: session.bookTitle.trim(),
    duration: Number(session.duration),
    date: "Today",
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(readingSessionsCollectionRef, newSession);

  return {
    id: docRef.id,
    ...newSession,
  };
};

export const deleteReadingSession = async (sessionId) => {
  const sessionDocRef = doc(db, "readingSessions", sessionId);
  await deleteDoc(sessionDocRef);
};