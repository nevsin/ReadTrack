import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "./firebase";

function getCurrentUserId() {
  const uid = auth.currentUser?.uid;

  if (!uid) {
    throw new Error("User is not authenticated.");
  }

  return uid;
}

function normalizeText(value) {
  return String(value || "").trim();
}

function normalizeBookKeyPart(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/İ/g, "i")
    .replace(/Ğ/g, "g")
    .replace(/Ü/g, "u")
    .replace(/Ş/g, "s")
    .replace(/Ö/g, "o")
    .replace(/Ç/g, "c")
    .replace(/\bkitabi\b/g, "")
    .replace(/\broman\b/g, "")
    .replace(/\bcep boy\b/g, "")
    .replace(/\bözel baski\b/g, "")
    .replace(/\bciltsiz\b/g, "")
    .replace(/\bciltli\b/g, "")
    .replace(/\bstefan zweig\b/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, "-");
}

function getBookTitle(book) {
  return normalizeText(book?.title || book?.bookName);
}

function getBookAuthor(book) {
  if (typeof book?.author === "string" && book.author.trim()) {
    return book.author.split(",")[0].trim();
  }

  if (Array.isArray(book?.authors) && book.authors.length > 0) {
    return String(book.authors[0] || "").trim();
  }

  return "";
}

function createBookKey(book) {
  const title = normalizeBookKeyPart(getBookTitle(book));
  const author = normalizeBookKeyPart(getBookAuthor(book));

  if (!title) {
    throw new Error("Book title is required for rating.");
  }

  if (!author) {
    return title;
  }

  return `${title}-${author}`;
}

function getBookRatingDocRef(book) {
  const bookKey = createBookKey(book);
  return doc(db, "globalBooks", bookKey);
}

function getUserRatingDocRef(book) {
  const uid = getCurrentUserId();
  const bookKey = createBookKey(book);

  return doc(db, "globalBooks", bookKey, "ratings", uid);
}

function normalizeRating(value) {
  const rating = Number(value);

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new Error("Rating must be an integer between 1 and 5.");
  }

  return rating;
}

export async function getBookRatingSummary(book) {
  const ratingRef = getBookRatingDocRef(book);
  const snapshot = await getDoc(ratingRef);

  if (!snapshot.exists()) {
    return {
      averageRating: 0,
      ratingCount: 0,
      ratingSum: 0,
    };
  }

  const data = snapshot.data();

  return {
    averageRating: Number(data.averageRating || 0),
    ratingCount: Number(data.ratingCount || 0),
    ratingSum: Number(data.ratingSum || 0),
  };
}

export async function getUserBookRating(book) {
  const userRatingRef = getUserRatingDocRef(book);
  const snapshot = await getDoc(userRatingRef);

  if (!snapshot.exists()) {
    return 0;
  }

  return Number(snapshot.data().rating || 0);
}

export async function getBookRatingData(book) {
  const [summary, userRating] = await Promise.all([
    getBookRatingSummary(book),
    getUserBookRating(book),
  ]);

  return {
    ...summary,
    userRating,
  };
}

export async function rateBook(book, ratingValue) {
  const uid = getCurrentUserId();
  const rating = normalizeRating(ratingValue);

  const ratingRef = getBookRatingDocRef(book);
  const userRatingRef = getUserRatingDocRef(book);

  await runTransaction(db, async (transaction) => {
    const ratingSnapshot = await transaction.get(ratingRef);
    const userRatingSnapshot = await transaction.get(userRatingRef);

    const previousUserRating = userRatingSnapshot.exists()
      ? Number(userRatingSnapshot.data().rating || 0)
      : 0;

    const previousRatingSum = ratingSnapshot.exists()
      ? Number(ratingSnapshot.data().ratingSum || 0)
      : 0;

    const previousRatingCount = ratingSnapshot.exists()
      ? Number(ratingSnapshot.data().ratingCount || 0)
      : 0;

    const isNewRating = !userRatingSnapshot.exists();

    const nextRatingSum = isNewRating
      ? previousRatingSum + rating
      : previousRatingSum - previousUserRating + rating;

    const nextRatingCount = isNewRating
      ? previousRatingCount + 1
      : previousRatingCount;

    const nextAverageRating =
      nextRatingCount > 0
        ? Number((nextRatingSum / nextRatingCount).toFixed(1))
        : 0;

    transaction.set(
      ratingRef,
      {
        bookKey: createBookKey(book),
        googleBooksId: normalizeText(book?.googleBooksId || book?.id),
        title: getBookTitle(book),
        author: getBookAuthor(book),
        thumbnail: normalizeText(book?.thumbnail || book?.cover),
        averageRating: nextAverageRating,
        ratingCount: nextRatingCount,
        ratingSum: nextRatingSum,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    transaction.set(
      userRatingRef,
      {
        userId: uid,
        rating,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  });

  return getBookRatingData(book);
}

export async function attachRatingsToBooks(books = []) {
  const booksWithRatings = await Promise.all(
    books.map(async (book) => {
      try {
        const ratingData = await getBookRatingData(book);

        return {
          ...book,
          ...ratingData,
        };
      } catch (error) {
        console.error("Failed to load rating for book:", book?.title, error);

        return {
          ...book,
          averageRating: 0,
          ratingCount: 0,
          ratingSum: 0,
          userRating: 0,
        };
      }
    })
  );

  return booksWithRatings;
}