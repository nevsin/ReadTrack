function SearchPage({
  searchTerm,
  setSearchTerm,
  handleSearchBooks,
  isSearching,
  searchError,
  searchResults,
  handleAddSearchResultToLibrary,
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

  const searchFormStyle = {
    display: "flex",
    gap: "14px",
    alignItems: "center",
    marginBottom: "24px",
  };

  const inputStyle = {
    flex: 1,
    padding: "15px 16px",
    borderRadius: "15px",
    border: "1px solid #ddd1f7",
    fontSize: "15px",
    backgroundColor: "#fcfbff",
    color: "#24153f",
    boxSizing: "border-box",
  };

  const buttonStyle = {
    padding: "15px 22px",
    borderRadius: "15px",
    border: "none",
    background: "linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)",
    color: "white",
    fontSize: "15px",
    fontWeight: "800",
    cursor: isSearching ? "not-allowed" : "pointer",
    opacity: isSearching ? 0.7 : 1,
    boxShadow: "0 12px 24px rgba(139, 92, 246, 0.22)",
  };

  const resultsGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "18px",
  };

  const bookCardStyle = {
    border: "1px solid #eee5fb",
    borderRadius: "22px",
    padding: "18px",
    background: "linear-gradient(180deg, #fcfbff 0%, #f8f3ff 100%)",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    boxShadow: "0 10px 24px rgba(76, 29, 149, 0.04)",
    position: "relative",
    overflow: "hidden",
  };

  const coverStyle = {
    width: "72px",
    height: "108px",
    borderRadius: "14px",
    overflow: "hidden",
    background:
      "linear-gradient(135deg, #2a1647 0%, #7c3aed 55%, #c084fc 100%)",
    boxShadow: "0 10px 20px rgba(76, 29, 149, 0.14)",
    flexShrink: 0,
  };

  const titleBookStyle = {
    margin: "0 0 8px 0",
    fontSize: "18px",
    color: "#24153f",
    lineHeight: "1.35",
  };

  const authorStyle = {
    margin: "0 0 10px 0",
    color: "#7c6a96",
    fontSize: "14px",
    lineHeight: "1.4",
  };

  const metaStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "8px",
  };

  const tagStyle = {
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 9px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    backgroundColor: "#f3e8ff",
    color: "#7c3aed",
  };

  const ratingBoxStyle = {
    border: "1px solid #eadffc",
    background: "rgba(255,255,255,0.72)",
    borderRadius: "16px",
    padding: "12px",
    display: "grid",
    gap: "6px",
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
    color: "#24153f",
    fontSize: "14px",
    fontWeight: "800",
  };

  const starPreviewStyle = {
    display: "flex",
    gap: "2px",
    color: "#f59e0b",
    fontSize: "17px",
    lineHeight: "1",
  };

  const addButtonStyle = {
    border: "none",
    borderRadius: "14px",
    padding: "12px 14px",
    background: "linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)",
    color: "white",
    cursor: "pointer",
    fontWeight: "800",
    boxShadow: "0 10px 20px rgba(139, 92, 246, 0.18)",
  };

  const emptyTextStyle = {
    margin: "18px 0 0 0",
    color: "#7c6a96",
    fontSize: "15px",
    lineHeight: "1.6",
  };

  const errorStyle = {
    margin: "0 0 18px 0",
    padding: "12px 14px",
    borderRadius: "14px",
    backgroundColor: "#fff1f2",
    color: "#be123c",
    border: "1px solid #fecdd3",
    fontWeight: "700",
  };

  function handleSubmit(event) {
    event.preventDefault();
    handleSearchBooks();
  }

  function getCover(book) {
    return book.cover || book.thumbnail || "";
  }

  function getAverageRatingText(book) {
    const average = Number(book.averageRating || 0);
    const count = Number(book.ratingCount || 0);

    if (!average || !count) {
      return "No community rating yet";
    }

    return `${average.toFixed(1)} / 5 · ${count} rating${count > 1 ? "s" : ""}`;
  }

  function getRoundedStars(book) {
    const average = Number(book.averageRating || 0);

    if (!average) {
      return 0;
    }

    return Math.round(average);
  }

  function getCategoryText(book) {
    if (Array.isArray(book.categories) && book.categories.length > 0) {
      return book.categories[0];
    }

    if (Array.isArray(book.subjects) && book.subjects.length > 0) {
      return book.subjects[0];
    }

    return "";
  }

  return (
    <div style={pageWrapStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>Book Search</h2>
        <p style={subtitleStyle}>
          Search books using Google Books data, view community ratings, and add
          selected books to your personal library.
        </p>
      </div>

      <div style={cardStyle}>
        <form onSubmit={handleSubmit} style={searchFormStyle}>
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by book title, author, or keyword"
            style={inputStyle}
          />

          <button type="submit" disabled={isSearching} style={buttonStyle}>
            {isSearching ? "Searching..." : "Search"}
          </button>
        </form>

        {searchError && <p style={errorStyle}>{searchError}</p>}

        {searchResults.length === 0 && !isSearching && !searchError && (
          <p style={emptyTextStyle}>
            Search for a book to see results with community rating information.
          </p>
        )}

        <div style={resultsGridStyle}>
          {searchResults.map((book) => {
            const cover = getCover(book);
            const category = getCategoryText(book);
            const roundedStars = getRoundedStars(book);

            return (
              <div key={book.googleBooksId || book.id || book.title} style={bookCardStyle}>
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "6px",
                    background:
                      "linear-gradient(90deg, #d8b4fe 0%, #e9d5ff 100%)",
                  }}
                />

                <div style={{ display: "flex", gap: "14px", paddingTop: "8px" }}>
                  <div style={coverStyle}>
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
                    <h4 style={titleBookStyle}>{book.title}</h4>
                    <p style={authorStyle}>{book.author}</p>

                    <div style={metaStyle}>
                      {book.publishedDate && (
                        <span style={tagStyle}>{book.publishedDate}</span>
                      )}

                      {book.pageCount && (
                        <span style={tagStyle}>{book.pageCount} pages</span>
                      )}

                      {category && <span style={tagStyle}>{category}</span>}
                    </div>
                  </div>
                </div>

                <div style={ratingBoxStyle}>
                  <p style={ratingLabelStyle}>Community Rating</p>

                  <p style={ratingTextStyle}>{getAverageRatingText(book)}</p>

                  <div style={starPreviewStyle}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        style={{
                          color: star <= roundedStars ? "#f59e0b" : "#d8c9ef",
                        }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleAddSearchResultToLibrary(book)}
                  style={addButtonStyle}
                >
                  Add to Library
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default SearchPage;