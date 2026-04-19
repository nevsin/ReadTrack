import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "./firebase";

export const registerUser = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email.trim(),
    password
  );

  await sendEmailVerification(userCredential.user);
  await signOut(auth);

  return userCredential.user;
};

export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email.trim(),
    password
  );

  await userCredential.user.reload();

  if (!userCredential.user.emailVerified) {
    await signOut(auth);
    const error = new Error("Email not verified");
    error.code = "auth/email-not-verified";
    throw error;
  }

  return userCredential.user;
};

export const sendResetPasswordEmail = async (email) => {
  await sendPasswordResetEmail(auth, email.trim());
};

export const logoutUser = async () => {
  await signOut(auth);
};

export const observeAuthState = (callback) => {
  return onAuthStateChanged(auth, callback);
};