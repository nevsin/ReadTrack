import { useEffect, useMemo, useState } from "react"
import StatCard from "./StatCard"
import { GOOGLE_BOOKS_API_KEY } from "../config"
import {
  statIcons,
  yearlyBookGoal,
  initialRecentSessions,
  initialRecommendations,
} from "../data/dashboardData"
import {
  addLibraryBook,
  deleteLibraryBook,
  getLibraryBooks,
  updateLibraryBookStatus,
} from "../libraryService"

function Dashboard() {
  function getStatusStyle(status) {
    if (status === "Completed") {
      return {
        backgroundColor: "#dcfce7",
        color: "#166534",
      }
    }

    if (status === "Reading") {
      return {
        backgroundColor: "#dbeafe",
        color: "#1d4ed8",
      }
    }

    return {
      backgroundColor: "#e2e8f0",
      color: "#475569",
    }
  }

  const [recentSessions, setRecentSessions] = useState(initialRecentSessions)
  const [recommendations] = useState(initialRecommendations)
  const [libraryBooks, setLibraryBooks] = useState([])

  const [bookTitle, setBookTitle] = useState("")
  const [duration, setDuration] = useState("")

  const [bookName, setBookName] = useState("")
  const [authorName, setAuthorName] = useState("")
  const [bookStatus, setBookStatus] = useState("Want to Read")

  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState("")

  useEffect(() => {
    async function loadLibraryBooks() {
      try {
        const books = await getLibraryBooks()
        setLibraryBooks(books)
      } catch (error) {
        console.error("Failed to load library books:", error)
      }
    }

    loadLibraryBooks()
  }, [])

  const totalReadingTime = useMemo(() => {
    return recentSessions.reduce((total, session) => total + session.duration, 0)
  }, [recentSessions])

  const booksRead = useMemo(() => {
    const uniqueBooks = new Set(
      recentSessions.map((session) => session.bookTitle.trim().toLowerCase())
    )
    return uniqueBooks.size
  }, [recentSessions])

  const goalProgress = useMemo(() => {
    return Math.min(Math.round((booksRead / yearlyBookGoal) * 100), 100)
  }, [booksRead])

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
  ]

  function handleAddSession(event) {
    event.preventDefault()

    if (!bookTitle.trim() || !duration.trim()) {
      return
    }

    const newSession = {
      id: Date.now(),
      bookTitle: bookTitle.trim(),
      duration: Number(duration),
      date: "Today",
    }

    setRecentSessions((prevSessions) => [newSession, ...prevSessions])
    setBookTitle("")
    setDuration("")
  }

  function handleDeleteSession(sessionId) {
    setRecentSessions((prevSessions) =>
      prevSessions.filter((session) => session.id !== sessionId)
    )
  }

  async function handleAddBook(event) {
    event.preventDefault()

    if (!bookName.trim() || !authorName.trim()) {
      return
    }

    const newBook = {
      title: bookName.trim(),
      author: authorName.trim(),
      status: bookStatus,
    }

    try {
      const savedBook = await addLibraryBook(newBook)
      setLibraryBooks((prevBooks) => [savedBook, ...prevBooks])
      setBookName("")
      setAuthorName("")
      setBookStatus("Want to Read")
    } catch (error) {
      console.error("Failed to add book:", error)
    }
  }

  async function handleDeleteBook(bookId) {
    try {
      await deleteLibraryBook(bookId)
      setLibraryBooks((prevBooks) =>
        prevBooks.filter((book) => book.id !== bookId)
      )
    } catch (error) {
      console.error("Failed to delete book:", error)
    }
  }

  async function handleUpdateBookStatus(bookId, newStatus) {
    try {
      await updateLibraryBookStatus(bookId, newStatus)

      setLibraryBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.id === bookId ? { ...book, status: newStatus } : book
        )
      )
    } catch (error) {
      console.error("Failed to update status:", error)
    }
  }

  async function handleAddSearchResultToLibrary(book) {
    const alreadyExists = libraryBooks.some(
      (libraryBook) =>
        libraryBook.title.toLowerCase() === book.title.toLowerCase()
    )

    if (alreadyExists) {
      return
    }

    const newBook = {
      title: book.title,
      author: book.author,
      status: "Want to Read",
    }

    try {
      const savedBook = await addLibraryBook(newBook)
      setLibraryBooks((prevBooks) => [savedBook, ...prevBooks])
    } catch (error) {
      console.error("Failed to add searched book:", error)
    }
  }

  async function handleSearchBooks() {
    if (!searchTerm.trim()) {
      return
    }

    setIsSearching(true)
    setSearchError("")

    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          searchTerm
        )}&maxResults=6&key=${GOOGLE_BOOKS_API_KEY}`
      )

      if (!response.ok) {
        throw new Error("Failed to fetch books")
      }

      const data = await response.json()

      const books = (data.items || []).map((item) => ({
        id: item.id,
        title: item.volumeInfo?.title || "Untitled",
        author: item.volumeInfo?.authors?.join(", ") || "Unknown Author",
        cover:
          item.volumeInfo?.imageLinks?.thumbnail ||
          "https://placehold.co/300x450?text=No+Cover",
        status: "Want to Read",
      }))

      setSearchResults(books)
    } catch (error) {
      setSearchError("Could not load books. Please try again.")
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div style={{ marginTop: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <h2
          style={{
            margin: "0 0 8px 0",
            fontSize: "28px",
            color: "#0f172a",
          }}
        >
          Dashboard
        </h2>

        <p
          style={{
            margin: 0,
            color: "#64748b",
            fontSize: "16px",
          }}
        >
          Track your reading progress and activity overview
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginTop: "20px",
          flexWrap: "wrap",
        }}
      >
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
          />
        ))}
      </div>

      <div
        style={{
          marginTop: "28px",
          backgroundColor: "white",
          borderRadius: "20px",
          padding: "24px",
          boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
          border: "1px solid #e2e8f0",
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: "16px" }}>Log Reading Session</h3>

        <form
          onSubmit={handleAddSession}
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            alignItems: "end",
          }}
        >
          <div style={{ flex: 2, minWidth: "220px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                color: "#475569",
              }}
            >
              Book Title
            </label>
            <input
              type="text"
              value={bookTitle}
              onChange={(event) => setBookTitle(event.target.value)}
              placeholder="Enter book name"
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "12px",
                border: "1px solid #cbd5e1",
                fontSize: "15px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ flex: 1, minWidth: "160px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                color: "#475569",
              }}
            >
              Duration (min)
            </label>
            <input
              type="number"
              min="1"
              value={duration}
              onChange={(event) => setDuration(event.target.value)}
              placeholder="30"
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "12px",
                border: "1px solid #cbd5e1",
                fontSize: "15px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: "12px 18px",
              borderRadius: "12px",
              border: "none",
              backgroundColor: "#2563eb",
              color: "white",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer",
              height: "46px",
            }}
          >
            Add Session
          </button>
        </form>
      </div>

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginTop: "28px",
          alignItems: "stretch",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            flex: 2,
            minWidth: "320px",
            backgroundColor: "white",
            borderRadius: "20px",
            padding: "24px",
            boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
            border: "1px solid #e2e8f0",
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: "16px" }}>
            Recent Reading Sessions
          </h3>

          {recentSessions.map((session, index) => (
            <div
              key={session.id}
              style={{
                padding:
                  index === recentSessions.length - 1
                    ? "14px 0 0 0"
                    : "14px 0",
                borderBottom:
                  index === recentSessions.length - 1
                    ? "none"
                    : "1px solid #e2e8f0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <div>
                <strong>{session.bookTitle}</strong>
                <p style={{ margin: "6px 0 0 0", color: "#64748b" }}>
                  {session.duration} minutes • {session.date}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleDeleteSession(session.id)}
                style={{
                  border: "none",
                  backgroundColor: "#fee2e2",
                  color: "#b91c1c",
                  padding: "8px 12px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        <div
          style={{
            flex: 1,
            minWidth: "280px",
            backgroundColor: "white",
            borderRadius: "20px",
            padding: "24px",
            boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
            border: "1px solid #e2e8f0",
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: "8px" }}>Recommendations</h3>

          <p
            style={{
              marginTop: 0,
              marginBottom: "16px",
              color: "#64748b",
              fontSize: "14px",
            }}
          >
            Goal: {yearlyBookGoal} books this year
          </p>

          {recommendations.map((recommendation, index) => (
            <div
              key={recommendation.id}
              style={{
                marginBottom:
                  index === recommendations.length - 1 ? "0" : "16px",
              }}
            >
              <strong>{recommendation.title}</strong>
              <p style={{ margin: "6px 0 0 0", color: "#64748b" }}>
                {recommendation.reason}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          marginTop: "28px",
          backgroundColor: "white",
          borderRadius: "20px",
          padding: "24px",
          boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
          border: "1px solid #e2e8f0",
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: "16px" }}>My Library</h3>

        <form
          onSubmit={handleAddBook}
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            alignItems: "end",
            marginBottom: "20px",
          }}
        >
          <div style={{ flex: 2, minWidth: "220px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                color: "#475569",
              }}
            >
              Book Name
            </label>
            <input
              type="text"
              value={bookName}
              onChange={(event) => setBookName(event.target.value)}
              placeholder="Enter book title"
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "12px",
                border: "1px solid #cbd5e1",
                fontSize: "15px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ flex: 2, minWidth: "220px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                color: "#475569",
              }}
            >
              Author
            </label>
            <input
              type="text"
              value={authorName}
              onChange={(event) => setAuthorName(event.target.value)}
              placeholder="Enter author name"
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "12px",
                border: "1px solid #cbd5e1",
                fontSize: "15px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ flex: 1, minWidth: "180px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                color: "#475569",
              }}
            >
              Status
            </label>
            <select
              value={bookStatus}
              onChange={(event) => setBookStatus(event.target.value)}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "12px",
                border: "1px solid #cbd5e1",
                fontSize: "15px",
                outline: "none",
                boxSizing: "border-box",
                backgroundColor: "white",
              }}
            >
              <option>Want to Read</option>
              <option>Reading</option>
              <option>Completed</option>
            </select>
          </div>

          <button
            type="submit"
            style={{
              padding: "12px 18px",
              borderRadius: "12px",
              border: "none",
              backgroundColor: "#2563eb",
              color: "white",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer",
              height: "46px",
            }}
          >
            Add Book
          </button>
        </form>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
          }}
        >
          {libraryBooks.map((book) => (
            <div
              key={book.id}
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: "16px",
                padding: "18px",
                backgroundColor: "#f8fafc",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <div>
                <h4
                  style={{
                    margin: "0 0 8px 0",
                    fontSize: "18px",
                    color: "#0f172a",
                  }}
                >
                  {book.title}
                </h4>

                <p style={{ margin: "0 0 10px 0", color: "#64748b" }}>
                  {book.author}
                </p>

                <span
                  style={{
                    display: "inline-block",
                    padding: "6px 10px",
                    borderRadius: "999px",
                    fontSize: "13px",
                    fontWeight: "600",
                    ...getStatusStyle(book.status),
                  }}
                >
                  {book.status}
                </span>

                <div style={{ marginTop: "10px" }}>
                  <select
                    value={book.status}
                    onChange={(event) =>
                      handleUpdateBookStatus(book.id, event.target.value)
                    }
                    style={{
                      padding: "8px 10px",
                      borderRadius: "10px",
                      border: "1px solid #cbd5e1",
                      fontSize: "14px",
                      backgroundColor: "white",
                      color: "#0f172a",
                    }}
                  >
                    <option>Want to Read</option>
                    <option>Reading</option>
                    <option>Completed</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDeleteBook(book.id)}
                style={{
                  alignSelf: "flex-start",
                  border: "none",
                  backgroundColor: "#fee2e2",
                  color: "#b91c1c",
                  padding: "8px 12px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Delete Book
              </button>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          marginTop: "28px",
          backgroundColor: "white",
          borderRadius: "20px",
          padding: "24px",
          boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
          border: "1px solid #e2e8f0",
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: "16px" }}>Book Search</h3>

        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            alignItems: "end",
            marginBottom: "20px",
          }}
        >
          <div style={{ flex: 1, minWidth: "260px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                color: "#475569",
              }}
            >
              Search Book
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault()
                  handleSearchBooks()
                }
              }}
              placeholder="Search by title"
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "12px",
                border: "1px solid #cbd5e1",
                fontSize: "15px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            type="button"
            onClick={handleSearchBooks}
            style={{
              padding: "12px 18px",
              borderRadius: "12px",
              border: "none",
              backgroundColor: "#2563eb",
              color: "white",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer",
              height: "46px",
            }}
          >
            Search
          </button>
        </div>

        {isSearching && (
          <p style={{ color: "#64748b", marginBottom: "16px" }}>Searching books...</p>
        )}

        {searchError && (
          <p style={{ color: "#b91c1c", marginBottom: "16px" }}>{searchError}</p>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
          }}
        >
          {searchResults.map((book) => (
            <div
              key={book.id}
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: "16px",
                padding: "18px",
                backgroundColor: "#f8fafc",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
              }}
            >
              <img
                src={book.cover}
                alt={book.title}
                style={{
                  width: "100%",
                  height: "220px",
                  objectFit: "cover",
                  borderRadius: "12px",
                }}
              />

              <div>
                <h4
                  style={{
                    margin: "0 0 8px 0",
                    fontSize: "18px",
                    color: "#0f172a",
                  }}
                >
                  {book.title}
                </h4>

                <p style={{ margin: 0, color: "#64748b" }}>{book.author}</p>
              </div>

              <button
                type="button"
                onClick={() => handleAddSearchResultToLibrary(book)}
                style={{
                  alignSelf: "flex-start",
                  border: "none",
                  backgroundColor: "#dbeafe",
                  color: "#1d4ed8",
                  padding: "8px 12px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Add to Library
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard