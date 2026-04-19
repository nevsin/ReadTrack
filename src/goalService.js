import { auth, db } from "./firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

function getCurrentYear() {
  return new Date().getFullYear().toString();
}

function getUserGoalDocRef() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not authenticated");
  }

  const currentYear = getCurrentYear();

  return doc(db, "users", user.uid, "goals", currentYear);
}

export async function getYearlyGoal() {
  const goalRef = getUserGoalDocRef();
  const snapshot = await getDoc(goalRef);

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data();
}

export async function saveYearlyGoal(targetBooks) {
  const goalRef = getUserGoalDocRef();
  const currentYear = Number(getCurrentYear());

  await setDoc(
    goalRef,
    {
      year: currentYear,
      targetBooks: Number(targetBooks),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}