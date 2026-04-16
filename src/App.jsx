import { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import DashboardPage from "./pages/DashboardPage";
import LibraryPage from "./pages/LibraryPage";
import SessionsPage from "./pages/SessionsPage";
import SearchPage from "./pages/SearchPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import { GOOGLE_BOOKS_API_KEY } from "./config";
import { statIcons, yearlyBookGoal } from "./data/dashboardData";
import {
  addLibraryBook,
  deleteLibraryBook,
  getLibraryBooks,
  updateLibraryBookStatus,
  buildLibraryBookFromGoogleBook,
} from "./libraryService";
import {
  getReadingSessions,
  addReadingSession,
  deleteReadingSession,
} from "./sessionService";
import { getPersonalizedRecommendations } from "./recommendationService";
import "./App.css";

function App() {
  function getStatusStyle(status) {
    if (status === "Completed") {
      return {
        backgroundColor: "#dcfce7",
        color: "#166534",
      };
    }

    if (status === "Reading") {
      return {
        backgroundColor: "#dbeafe",
        color: "#1d4ed8",
      };
    }

    return {
      backgroundColor: "#e2e8f0",
      color: "#475569",
    };
  }

  const [recentSessions, setRecentSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);

  const [recommendations, setRecommendations] = useState([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(true);

  const [libraryBooks, setLibraryBooks] = useState([]);

  const [bookTitle, setBookTitle] = useState("");
  const [duration, setDuration] = useState("");

  const [bookName, setBookName] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [bookStatus, setBookStatus] = useState("Want to Read");

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  function normalizeText(value) {
    return String(value || "").trim().toLowerCase();
  }

  function safeArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function getBookTitle(book) {
    return String(book?.title || book?.bookName || "").trim();
  }

  function getPrimaryAuthor(book) {
    if (typeof book?.author === "string" && book.author.trim()) {
      return book.author.split(",")[0].trim();
    }

    if (Array.isArray(book?.authors) && book.authors.length > 0) {
      return String(book.authors[0] || "").trim();
    }

    return "";
  }

  function normalizeBooksForRecommendations(books = []) {
    return books.map((book) => ({
      ...book,
      title: getBookTitle(book),
      author: getPrimaryAuthor(book),
      categories: safeArray(book?.categories),
      language: book?.language || "",
      thumbnail: book?.thumbnail || book?.cover || "",
      cover: book?.cover || book?.thumbnail || "",
      description: book?.description || "",
      publishedDate: book?.publishedDate || "",
      pageCount: book?.pageCount || "",
    }));
  }

  async function getFreshRecommendations(books) {
    try {
      setRecommendationsLoading(true);

      const normalizedBooks = normalizeBooksForRecommendations(books || []);
      const recommendedBooks =
        await getPersonalizedRecommendations(normalizedBooks);

      setRecommendations(recommendedBooks || []);
    } catch (error) {
      console.error("Failed to refresh recommendations:", error);
      setRecommendations([]);
    } finally {
      setRecommendationsLoading(false);
    }
  }

  useEffect(() => {
    async function loadLibraryBooks() {
      try {
        const books = await getLibraryBooks();
        setLibraryBooks(books);
        await getFreshRecommendations(books);
      } catch (error) {
        console.error("Failed to load library books:", error);
      }
    }

    async function loadSessions() {
      try {
        setSessionsLoading(true);
        const sessions = await getReadingSessions();
        setRecentSessions(sessions);
      } catch (error) {
        console.error("Failed to load reading sessions:", error);
      } finally {
        setSessionsLoading(false);
      }
    }

    loadLibraryBooks();
    loadSessions();
  }, []);

  const totalReadingTime = useMemo(() => {
    return recentSessions.reduce(
      (total, session) => total + Number(session.duration || 0),
      0
    );
  }, [recentSessions]);

  const booksRead = useMemo(() => {
    const uniqueBooks = new Set(
      recentSessions
        .filter((session) => session.bookTitle?.trim())
        .map((session) => session.bookTitle.trim().toLowerCase())
    );

    return uniqueBooks.size;
  }, [recentSessions]);

  const goalProgress = useMemo(() => {
    return Math.min(Math.round((booksRead / yearlyBookGoal) * 100), 100);
  }, [booksRead]);

  const stats = [
    {
      title: "Books Read",
      value: String(booksRead),
      icon: statIcons.books,
    },
    {
      title: "Reading Time",
      value: `${totalReadingTime} min`,
      icon: statIcons.time,
    },
    {
      title: "Goal Progress",
      value: `${goalProgress}%`,
      icon: statIcons.goal,
    },
  ];

  async function handleAddSession(event) {
    event.preventDefault();

    if (!bookTitle.trim() || !duration.trim()) {
      return;
    }

    try {
      const savedSession = await addReadingSession({
        bookTitle,
        duration,
      });

      setRecentSessions((prevSessions) => [savedSession, ...prevSessions]);
      setBookTitle("");
      setDuration("");
    } catch (error) {
      console.error("Failed to add reading session:", error);
    }
  }

  async function handleDeleteSession(sessionId) {
    try {
      await deleteReadingSession(sessionId);

      setRecentSessions((prevSessions) =>
        prevSessions.filter((session) => session.id !== sessionId)
      );
    } catch (error) {
      console.error("Failed to delete reading session:", error);
    }
  }

  async function handleAddBook(event) {
    event.preventDefault();

    if (!bookName.trim() || !authorName.trim()) {
      return;
    }

    const newBook = {
      title: bookName.trim(),
      author: authorName.trim(),
      status: bookStatus,
    };

    try {
      const result = await addLibraryBook(newBook);

      if (result?.duplicate) {
        return;
      }

      const savedBook = {
        id: result.id,
        ...newBook,
        categories: [],
        language: "",
        thumbnail: "",
        cover: "",
        description: "",
        publishedDate: "",
        pageCount: "",
      };

      const updatedBooks = [savedBook, ...libraryBooks];
      setLibraryBooks(updatedBooks);

      setBookName("");
      setAuthorName("");
      setBookStatus("Want to Read");

      await getFreshRecommendations(updatedBooks);
    } catch (error) {
      console.error("Failed to add book:", error);
    }
  }

  async function handleDeleteBook(bookId) {
    try {
      await deleteLibraryBook(bookId);

      const updatedBooks = libraryBooks.filter((book) => book.id !== bookId);
      setLibraryBooks(updatedBooks);
      await getFreshRecommendations(updatedBooks);
    } catch (error) {
      console.error("Failed to delete book:", error);
    }
  }

  async function handleUpdateBookStatus(bookId, newStatus) {
    try {
      await updateLibraryBookStatus(bookId, newStatus);

      const updatedBooks = libraryBooks.map((book) =>
        book.id === bookId ? { ...book, status: newStatus } : book
      );

      setLibraryBooks(updatedBooks);
      await getFreshRecommendations(updatedBooks);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  }

  async function handleAddSearchResultToLibrary(book) {
    const alreadyExists = libraryBooks.some(
      (libraryBook) =>
        normalizeText(getBookTitle(libraryBook)) ===
          normalizeText(getBookTitle(book)) &&
        normalizeText(getPrimaryAuthor(libraryBook)) ===
          normalizeText(getPrimaryAuthor(book))
    );

    if (alreadyExists) {
      return;
    }

    const newBook = buildLibraryBookFromGoogleBook(book, "Want to Read");

    try {
      const result = await addLibraryBook(newBook);

      if (result?.duplicate) {
        return;
      }

      const savedBook = {
        id: result.id,
        ...newBook,
        cover: newBook.thumbnail || newBook.cover || "",
      };

      const updatedBooks = [savedBook, ...libraryBooks];
      setLibraryBooks(updatedBooks);
      await getFreshRecommendations(updatedBooks);
    } catch (error) {
      console.error("Failed to add searched book:", error);
    }
  }

  async function handleSearchBooks() {
    if (!searchTerm.trim()) {
      return;
    }

    setIsSearching(true);
    setSearchError("");

    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          searchTerm
        )}&maxResults=6&key=${GOOGLE_BOOKS_API_KEY}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }

      const data = await response.json();

      const books = (data.items || []).map((item) => ({
        id: item.id,
        googleBooksId: item.id,
        title: item.volumeInfo?.title || "Untitled",
        author: item.volumeInfo?.authors?.join(", ") || "Unknown Author",
        authors: item.volumeInfo?.authors || [],
        cover:
          item.volumeInfo?.imageLinks?.thumbnail ||
          "https://placehold.co/300x450?text=No+Cover",
        thumbnail:
          item.volumeInfo?.imageLinks?.thumbnail ||
          "https://placehold.co/300x450?text=No+Cover",
        categories: item.volumeInfo?.categories || [],
        subjects: item.volumeInfo?.categories || [],
        language: item.volumeInfo?.language || "",
        description: item.volumeInfo?.description || "",
        publishedDate: item.volumeInfo?.publishedDate || "",
        pageCount: item.volumeInfo?.pageCount || "",
        status: "Want to Read",
      }));

      setSearchResults(books);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchError("Could not load books. Please try again.");
    } finally {
      setIsSearching(false);
    }
  }

  const appStyle = {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top left, #f3ecff 0%, #faf7ff 30%, #f6f4fb 100%)",
    padding: "24px",
  };

  const layoutStyle = {
    maxWidth: "1500px",
    margin: "0 auto",
    display: "flex",
    gap: "24px",
    alignItems: "flex-start",
  };

  const contentStyle = {
    flex: 1,
    minHeight: "calc(100vh - 48px)",
  };

  return (
    <BrowserRouter>
      <div style={appStyle}>
        <div style={layoutStyle}>
          <Sidebar />

          <main style={contentStyle}>
            <Routes>
              <Route
                path="/"
                element={
                  <DashboardPage
                    stats={stats}
                    recentSessions={recentSessions}
                    recommendations={recommendations}
                    yearlyBookGoal={yearlyBookGoal}
                    goalProgress={goalProgress}
                    sessionsLoading={sessionsLoading}
                  />
                }
              />

              <Route
                path="/library"
                element={
                  <LibraryPage
                    libraryBooks={libraryBooks}
                    bookName={bookName}
                    setBookName={setBookName}
                    authorName={authorName}
                    setAuthorName={setAuthorName}
                    bookStatus={bookStatus}
                    setBookStatus={setBookStatus}
                    handleAddBook={handleAddBook}
                    handleDeleteBook={handleDeleteBook}
                    handleUpdateBookStatus={handleUpdateBookStatus}
                    getStatusStyle={getStatusStyle}
                  />
                }
              />

              <Route
                path="/sessions"
                element={
                  <SessionsPage
                    recentSessions={recentSessions}
                    bookTitle={bookTitle}
                    setBookTitle={setBookTitle}
                    duration={duration}
                    setDuration={setDuration}
                    handleAddSession={handleAddSession}
                    handleDeleteSession={handleDeleteSession}
                    sessionsLoading={sessionsLoading}
                  />
                }
              />

              <Route
                path="/search"
                element={
                  <SearchPage
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    handleSearchBooks={handleSearchBooks}
                    isSearching={isSearching}
                    searchError={searchError}
                    searchResults={searchResults}
                    handleAddSearchResultToLibrary={handleAddSearchResultToLibrary}
                  />
                }
              />

              <Route
                path="/recommendations"
                element={
                  <RecommendationsPage
                    recommendations={recommendations}
                    yearlyBookGoal={yearlyBookGoal}
                    goalProgress={goalProgress}
                    recommendationsLoading={recommendationsLoading}
                  />
                }
              />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;