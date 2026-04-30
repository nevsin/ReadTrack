import { useMemo, useState } from "react";

function LibraryPage({
  libraryBooks,
  bookName,
  setBookName,
  authorName,
  setAuthorName,
  bookStatus,
  setBookStatus,
  handleAddBook,
  handleDeleteBook,
  handleUpdateBookStatus,
  handleRateBook,
  getStatusStyle,
}) {
  const [activeTab, setActiveTab] = useState("Reading");

  const tabs = [
    { key: "Reading", label: "Reading" },
    { key: "Want to Read", label: "Want to Read" },
    { key: "Completed", label: "Completed" },
    { key: "Completed Before This Year", label: "Before This Year" },
    { key: "All", label: "All Books" },
  ];

  const counts = useMemo(() => {
    return {
      total: libraryBooks.length,
      reading: libraryBooks.filter((book) => book.status === "Reading").length,
      completed: libraryBooks.filter((book) => book.status === "Completed")
        .length,
      wantToRead: libraryBooks.filter((book) => book.status === "Want to Read")
        .length,
      beforeThisYear: libraryBooks.filter(
        (book) => book.status === "Completed Before This Year"
      ).length,
    };
  }, [libraryBooks]);

  const filteredBooks = useMemo(() => {
    const books =
      activeTab === "All"
        ? [...libraryBooks]
        : libraryBooks.filter((book) => book.status === activeTab);

    return books.sort((a, b) => {
      const titleA = String(a.title || "").toLocaleLowerCase("tr");
      const titleB = String(b.title || "").toLocaleLowerCase("tr");
      return titleA.localeCompare(titleB, "tr");
    });
  }, [libraryBooks, activeTab]);

  const pageWrapStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  };

  const headerStyle = {
    background: "linear-gradient(135deg, #ffffff 0%, #faf7ff 100%)",
    border: "1px solid #eee5fb",
    borderRadius: "28px",
    padding: "28px",
    boxShadow: "0 18px 40px rgba(76, 29, 149, 0.05)",
  };

  const titleStyle = {
    margin: "0 0 8px 0",
    fontSize: "32px",
    color: "#24153f",
    fontWeight: "700",
  };

  const subtitleStyle = {
    margin: 0,
    color: "#7c6a96",
    fontSize: "16px",
    lineHeight: "1.6",
  };

  const summaryGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "14px",
  };

  const summaryCardStyle = {
    background: "rgba(255, 255, 255, 0.9)",
    border: "1px solid #eee5fb",
    borderRadius: "20px",
    padding: "18px",
    boxShadow: "0 14px 28px rgba(76, 29, 149, 0.05)",
  };

  const summaryLabelStyle = {
    margin: "0 0 8px 0",
    color: "#7c6a96",
    fontSize: "13px",
    fontWeight: "700",
  };

  const summaryValueStyle = {
    margin: 0,
    color: "#24153f",
    fontSize: "28px",
    fontWeight: "800",
    lineHeight: "1",
  };

  const cardStyle = {
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.94) 0%, rgba(250,247,255,0.98) 100%)",
    borderRadius: "26px",
    padding: "28px",
    border: "1px solid #eee5fb",
    boxShadow: "0 18px 36px rgba(76, 29, 149, 0.06)",
  };

  const sectionTitleStyle = {
    marginTop: 0,
    marginBottom: "18px",
    fontSize: "24px",
    color: "#24153f",
    fontWeight: "700",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#6f5f88",
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "14px",
    border: "1px solid #ddd1f7",
    fontSize: "15px",
    backgroundColor: "#fcfbff",
    color: "#24153f",
    boxSizing: "border-box",
  };

  const buttonStyle = {
    padding: "14px 20px",
    borderRadius: "14px",
    border: "none",
    background: "linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)",
    color: "white",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    height: "50px",
    boxShadow: "0 12px 24px rgba(139, 92, 246, 0.22)",
  };

  const deleteButtonStyle = {
    alignSelf: "flex-start",
    border: "1px solid #f9cfe0",
    background: "linear-gradient(180deg, #fff7fb 0%, #fdeef5 100%)",
    color: "#be185d",
    padding: "9px 13px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px",
    boxShadow: "0 6px 14px rgba(190, 24, 93, 0.08)",
  };

  const tabWrapStyle = {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "22px",
  };

  const bookGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
    gap: "18px",
  };

  const bookCardStyle = {
    border: "1px solid #eee5fb",
    borderRadius: "22px",
    padding: "20px",
    background: "linear-gradient(180deg, #fcfbff 0%, #f8f3ff 100%)",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    boxShadow: "0 10px 24px rgba(76, 29, 149, 0.04)",
    position: "relative",
    overflow: "hidden",
  };

  const ratingBoxStyle = {
    border: "1px solid #eadffc",
    background: "rgba(255,255,255,0.72)",
    borderRadius: "16px",
    padding: "12px",
    display: "grid",
    gap: "8px",
  };

  const ratingTopStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
  };

  const ratingLabelStyle = {
    margin: 0,
    color: "#6f5f88",
    fontSize: "12px",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  };

  const ratingTextStyle = {
    margin: 0,
    color: "#7c6a96",
    fontSize: "13px",
    lineHeight: "1.45",
  };

  const starRowStyle = {
    display: "flex",
    alignItems: "center",
    gap: "4px",
  };

  const starButtonBaseStyle = {
    border: "none",
    background: "transparent",
    padding: "0 1px",
    cursor: "pointer",
    fontSize: "22px",
    lineHeight: "1",
  };

  function getAccentBar(status) {
    if (status === "Completed") {
      return "linear-gradient(90deg, #86efac 0%, #bbf7d0 100%)";
    }

    if (status === "Completed Before This Year") {
      return "linear-gradient(90deg, #bef264 0%, #d9f99d 100%)";
    }

    if (status === "Reading") {
      return "linear-gradient(90deg, #93c5fd 0%, #bfdbfe 100%)";
    }

    return "linear-gradient(90deg, #d8b4fe 0%, #e9d5ff 100%)";
  }

  function getBookCover(book) {
    return book.thumbnail || book.cover || "";
  }

  function getAverageRatingText(book) {
    const average = Number(book.averageRating || 0);
    const count = Number(book.ratingCount || 0);

    if (!average || !count) {
      return "No community rating yet";
    }

    return `${average.toFixed(1)} / 5 · ${count} rating${count > 1 ? "s" : ""}`;
  }

  function getTabCount(tabKey) {
    if (tabKey === "Reading") return counts.reading;
    if (tabKey === "Want to Read") return counts.wantToRead;
    if (tabKey === "Completed") return counts.completed;
    if (tabKey === "Completed Before This Year") return counts.beforeThisYear;
    return counts.total;
  }

  return (
    <div style={pageWrapStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>My Library</h2>
        <p style={subtitleStyle}>
          Save books, organize your reading list, and rate completed books based
          on your reading experience.
        </p>
      </div>

      <div style={summaryGridStyle}>
        <div style={summaryCardStyle}>
          <p style={summaryLabelStyle}>Total Books</p>
          <h3 style={summaryValueStyle}>{counts.total}</h3>
        </div>

        <div style={summaryCardStyle}>
          <p style={summaryLabelStyle}>Currently Reading</p>
          <h3 style={summaryValueStyle}>{counts.reading}</h3>
        </div>

        <div style={summaryCardStyle}>
          <p style={summaryLabelStyle}>Completed</p>
          <h3 style={summaryValueStyle}>{counts.completed}</h3>
        </div>

        <div style={summaryCardStyle}>
          <p style={summaryLabelStyle}>Want to Read</p>
          <h3 style={summaryValueStyle}>{counts.wantToRead}</h3>
        </div>
      </div>

      <div style={cardStyle}>
        <h3 style={sectionTitleStyle}>Add a Book</h3>

        <form
          onSubmit={handleAddBook}
          style={{
            display: "flex",
            gap: "14px",
            flexWrap: "wrap",
            alignItems: "end",
            marginBottom: "24px",
          }}
        >
          <div style={{ flex: 2, minWidth: "220px" }}>
            <label style={labelStyle}>Book Name</label>
            <input
              type="text"
              value={bookName}
              onChange={(event) => setBookName(event.target.value)}
              placeholder="Enter book title"
              style={inputStyle}
            />
          </div>

          <div style={{ flex: 2, minWidth: "220px" }}>
            <label style={labelStyle}>Author</label>
            <input
              type="text"
              value={authorName}
              onChange={(event) => setAuthorName(event.target.value)}
              placeholder="Enter author name"
              style={inputStyle}
            />
          </div>

          <div style={{ flex: 1, minWidth: "220px" }}>
            <label style={labelStyle}>Status</label>
            <select
              value={bookStatus}
              onChange={(event) => setBookStatus(event.target.value)}
              style={inputStyle}
            >
              <option>Want to Read</option>
              <option>Reading</option>
              <option>Completed</option>
              <option>Completed Before This Year</option>
            </select>
          </div>

          <button type="submit" style={buttonStyle}>
            Add Book
          </button>
        </form>

        <div style={tabWrapStyle}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                style={{
                  border: isActive ? "1px solid #8b5cf6" : "1px solid #eadffc",
                  background: isActive
                    ? "linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)"
                    : "#ffffff",
                  color: isActive ? "#ffffff" : "#6f5f88",
                  padding: "11px 14px",
                  borderRadius: "999px",
                  cursor: "pointer",
                  fontWeight: "800",
                  boxShadow: isActive
                    ? "0 12px 22px rgba(139, 92, 246, 0.2)"
                    : "0 8px 18px rgba(76, 29, 149, 0.04)",
                }}
              >
                {tab.label} ({getTabCount(tab.key)})
              </button>
            );
          })}
        </div>

        <div style={bookGridStyle}>
          {filteredBooks.map((book) => {
            const cover = getBookCover(book);
            const userRating = Number(book.userRating || 0);
            const canRate =
              book.status === "Completed" ||
              book.status === "Completed Before This Year";
              
            return (
              <div key={book.id} style={bookCardStyle}>
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "6px",
                    background: getAccentBar(book.status),
                  }}
                />

                <div style={{ display: "flex", gap: "14px", paddingTop: "8px" }}>
                  <div
                    style={{
                      width: "62px",
                      height: "92px",
                      borderRadius: "14px",
                      overflow: "hidden",
                      background:
                        "linear-gradient(135deg, #2a1647 0%, #7c3aed 55%, #c084fc 100%)",
                      boxShadow: "0 10px 20px rgba(76, 29, 149, 0.14)",
                      flexShrink: 0,
                    }}
                  >
                    {cover ? (
                      <img
                        src={cover}
                        alt={book.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "grid",
                          placeItems: "center",
                          color: "white",
                          fontSize: "24px",
                          fontWeight: "800",
                        }}
                      >
                        {book.title?.charAt(0)?.toUpperCase() || "B"}
                      </div>
                    )}
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <h4
                      style={{
                        margin: "0 0 8px 0",
                        fontSize: "18px",
                        color: "#24153f",
                        lineHeight: "1.35",
                      }}
                    >
                      {book.title}
                    </h4>

                    <p
                      style={{
                        margin: "0 0 12px 0",
                        color: "#7c6a96",
                        fontSize: "14px",
                        lineHeight: "1.4",
                      }}
                    >
                      {book.author}
                    </p>

                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "6px 10px",
                        borderRadius: "999px",
                        fontSize: "12px",
                        fontWeight: "700",
                        letterSpacing: "0.2px",
                        ...getStatusStyle(book.status),
                      }}
                    >
                      {book.status}
                    </span>
                  </div>
                </div>

                {canRate && (
                  <div style={ratingBoxStyle}>
                    <div style={ratingTopStyle}>
                      <p style={ratingLabelStyle}>Book Rating</p>
                      <p style={{ ...ratingTextStyle, fontWeight: "800" }}>
                        {getAverageRatingText(book)}
                      </p>
                    </div>

                    <div>
                      <p style={ratingTextStyle}>
                        Your rating:{" "}
                        <strong style={{ color: "#24153f" }}>
                          {userRating ? `${userRating}/5` : "Not rated"}
                        </strong>
                      </p>

                      <div style={starRowStyle}>
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            type="button"
                            onClick={() => handleRateBook(book, rating)}
                            style={{
                              ...starButtonBaseStyle,
                              color:
                                rating <= userRating ? "#f59e0b" : "#d8c9ef",
                            }}
                            aria-label={`Rate ${rating} out of 5`}
                            title={`Rate ${rating} out of 5`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <select
                  value={book.status}
                  onChange={(event) =>
                    handleUpdateBookStatus(book.id, event.target.value)
                  }
                  style={inputStyle}
                >
                  <option>Want to Read</option>
                  <option>Reading</option>
                  <option>Completed</option>
                  <option>Completed Before This Year</option>
                </select>

                <button
                  type="button"
                  onClick={() => handleDeleteBook(book.id)}
                  style={deleteButtonStyle}
                >
                  Delete
                </button>
              </div>
            );
          })}
        </div>

        {filteredBooks.length === 0 && (
          <p style={{ marginTop: "20px", color: "#7c6a96" }}>
            No books found in this section.
          </p>
        )}
      </div>
    </div>
  );
}

export default LibraryPage;