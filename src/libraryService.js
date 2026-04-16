import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

const libraryCollection = collection(db, "libraryBooks");

function normalizeText(value) {
  return String(value || "").trim();
}

function normalizeStatus(status) {
  const value = normalizeText(status).toLowerCase();

  if (value === "completed") return "Completed";
  if (value === "reading") return "Reading";
  return "Want to Read";
}

function safeArray(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function dedupeArray(values = []) {
  return [...new Set(values.map((item) => normalizeText(item)).filter(Boolean))];
}

function mapLibraryBook(item) {
  const data = item.data();

  return {
    id: item.id,
    title: data.title || data.bookName || "",
    bookName: data.title || data.bookName || "",
    author: data.author || "",
    status: data.status || "Want to Read",

    googleBooksId: data.googleBooksId || "",
    categories: safeArray(data.categories),
    language: data.language || "",
    thumbnail: data.thumbnail || data.cover || "",
    cover: data.thumbnail || data.cover || "",
    description: data.description || "",
    publishedDate: data.publishedDate || "",
    pageCount: data.pageCount || "",

    createdAt: data.createdAt || null,
  };
}

export function buildLibraryBookFromGoogleBook(googleBook, status = "Want to Read") {
  return {
    title: googleBook?.title || "",
    author:
      googleBook?.author ||
      (Array.isArray(googleBook?.authors) ? googleBook.authors.join(", ") : ""),
    status: normalizeStatus(status),

    googleBooksId: googleBook?.googleBooksId || googleBook?.id || "",
    categories: dedupeArray(googleBook?.categories || googleBook?.subjects || []),
    language: googleBook?.language || "",
    thumbnail: googleBook?.thumbnail || googleBook?.cover || "",
    description: googleBook?.description || "",
    publishedDate: googleBook?.publishedDate || "",
    pageCount: googleBook?.pageCount || "",
  };
}

export async function getLibraryBooks() {
  const snapshot = await getDocs(libraryCollection);

  const books = snapshot.docs.map(mapLibraryBook);

  return books.sort((a, b) => {
    const aTime = a.createdAt?.seconds
      ? a.createdAt.seconds
      : a.createdAt instanceof Date
      ? a.createdAt.getTime()
      : 0;

    const bTime = b.createdAt?.seconds
      ? b.createdAt.seconds
      : b.createdAt instanceof Date
      ? b.createdAt.getTime()
      : 0;

    return bTime - aTime;
  });
}

export async function addLibraryBook(book) {
  const payload = {
    title: normalizeText(book?.title || book?.bookName),
    author: normalizeText(book?.author),
    status: normalizeStatus(book?.status),

    googleBooksId: normalizeText(book?.googleBooksId),
    categories: dedupeArray(book?.categories || book?.subjects || []),
    language: normalizeText(book?.language),
    thumbnail: normalizeText(book?.thumbnail || book?.cover),
    description: normalizeText(book?.description),
    publishedDate: normalizeText(book?.publishedDate),
    pageCount: book?.pageCount || "",

    createdAt: new Date(),
  };

  if (!payload.title || !payload.author) {
    throw new Error("Book title and author are required.");
  }

  const snapshot = await getDocs(libraryCollection);

  const duplicate = snapshot.docs.some((item) => {
    const data = item.data();

    const existingTitle = normalizeText(data.title || data.bookName).toLowerCase();
    const existingAuthor = normalizeText(data.author).toLowerCase();

    return (
      existingTitle === payload.title.toLowerCase() &&
      existingAuthor === payload.author.toLowerCase()
    );
  });

  if (duplicate) {
    return {
      success: false,
      duplicate: true,
      message: "This book is already in your library.",
    };
  }

  const docRef = await addDoc(libraryCollection, payload);

  return {
    success: true,
    duplicate: false,
    id: docRef.id,
    ...payload,
  };
}

export async function deleteLibraryBook(bookId) {
  await deleteDoc(doc(db, "libraryBooks", bookId));
}

export async function updateLibraryBookStatus(bookId, newStatus) {
  await updateDoc(doc(db, "libraryBooks", bookId), {
    status: normalizeStatus(newStatus),
  });
}

export async function updateLibraryBook(bookId, updates = {}) {
  const payload = {};

  if (updates.title !== undefined || updates.bookName !== undefined) {
    payload.title = normalizeText(updates.title || updates.bookName);
  }

  if (updates.author !== undefined) {
    payload.author = normalizeText(updates.author);
  }

  if (updates.status !== undefined) {
    payload.status = normalizeStatus(updates.status);
  }

  if (updates.googleBooksId !== undefined) {
    payload.googleBooksId = normalizeText(updates.googleBooksId);
  }

  if (updates.categories !== undefined || updates.subjects !== undefined) {
    payload.categories = dedupeArray(updates.categories || updates.subjects || []);
  }

  if (updates.language !== undefined) {
    payload.language = normalizeText(updates.language);
  }

  if (updates.thumbnail !== undefined || updates.cover !== undefined) {
    payload.thumbnail = normalizeText(updates.thumbnail || updates.cover);
  }

  if (updates.description !== undefined) {
    payload.description = normalizeText(updates.description);
  }

  if (updates.publishedDate !== undefined) {
    payload.publishedDate = normalizeText(updates.publishedDate);
  }

  if (updates.pageCount !== undefined) {
    payload.pageCount = updates.pageCount || "";
  }

  await updateDoc(doc(db, "libraryBooks", bookId), payload);
}