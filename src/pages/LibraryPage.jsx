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
  getStatusStyle,
}) {
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

  return (
    <div style={pageWrapStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>My Library</h2>
        <p style={subtitleStyle}>
          Save books, organize your reading list, and update reading status
          easily.
        </p>
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

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "18px",
          }}
        >
          {libraryBooks.map((book) => (
            <div
              key={book.id}
              style={{
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
              }}
            >
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

              <div style={{ paddingTop: "8px" }}>
                <h4
                  style={{
                    margin: "0 0 8px 0",
                    fontSize: "19px",
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
                    fontSize: "15px",
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
          ))}
        </div>

        {libraryBooks.length === 0 && (
          <p style={{ marginTop: "20px", color: "#7c6a96" }}>
            No books in your library yet.
          </p>
        )}
      </div>
    </div>
  );
}

export default LibraryPage;