import { auth, db } from "./firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

function getCurrentYear() {
  return new Date().getFullYear();
}

function getUserGoalDocRef(year = getCurrentYear()) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not authenticated");
  }

  return doc(db, "users", user.uid, "goals", String(year));
}

export async function getYearlyGoal(year = getCurrentYear()) {
  const goalRef = getUserGoalDocRef(year);
  const snapshot = await getDoc(goalRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}

export async function saveYearlyGoal(
  targetBooks,
  year = getCurrentYear()
) {
  const goalRef = getUserGoalDocRef(year);

  await setDoc(
    goalRef,
    {
      year: Number(year),
      targetBooks: Number(targetBooks),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}