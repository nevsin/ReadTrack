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

function formatSessionDate(createdAt, fallbackDate) {
  if (!createdAt?.toDate) {
    return fallbackDate || "Recently";
  }

  const sessionDate = createdAt.toDate();
  const today = new Date();

  const isToday =
    sessionDate.getDate() === today.getDate() &&
    sessionDate.getMonth() === today.getMonth() &&
    sessionDate.getFullYear() === today.getFullYear();

  if (isToday) {
    return "Today";
  }

  return sessionDate.toLocaleDateString("en-GB");
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
      date: formatSessionDate(data.createdAt, data.date),
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
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(readingSessionsCollectionRef, newSession);

  return {
    id: docRef.id,
    ...newSession,
    date: "Today",
  };
};

export const deleteReadingSession = async (sessionId) => {
  const uid = getCurrentUserId();
  const sessionDocRef = doc(db, "users", uid, "readingSessions", sessionId);
  await deleteDoc(sessionDocRef);
};