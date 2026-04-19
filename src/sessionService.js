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
import { db, auth } from "./firebase";

function getCurrentUserId() {
  const uid = auth.currentUser?.uid;

  if (!uid) {
    throw new Error("User is not authenticated.");
  }

  return uid;
}

function getReadingSessionsCollectionRef() {
  const uid = getCurrentUserId();
  return collection(db, "users", uid, "readingSessions");
}

export const getReadingSessions = async () => {
  const readingSessionsCollectionRef = getReadingSessionsCollectionRef();
  const q = query(readingSessionsCollectionRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docItem) => {
    const data = docItem.data();

    return {
      id: docItem.id,
      bookTitle: data.bookTitle || "",
      duration: data.duration || 0,
      pagesRead: data.pagesRead || 0,
      date: data.date || "Recently",
      createdAt: data.createdAt || null,
    };
  });
};

export const addReadingSession = async (session) => {
  const readingSessionsCollectionRef = getReadingSessionsCollectionRef();

  const newSession = {
    bookTitle: String(session.bookTitle || "").trim(),
    duration: Number(session.duration) || 0,
    pagesRead: Number(session.pagesRead) || 0,
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
  const uid = getCurrentUserId();
  const sessionDocRef = doc(db, "users", uid, "readingSessions", sessionId);
  await deleteDoc(sessionDocRef);
};