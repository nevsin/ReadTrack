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
    background: "linear-gradient(180deg, rgba(255,255,255,0.94) 0%, rgba(250,247,255,0.98) 100%)",
    borderRadius: "26px",
    padding: "28px",
    border: "1px solid #eee5fb",
    boxShadow: "0 18px 36px rgba(76, 29, 149, 0.06)",
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

  const addButtonStyle = {
    alignSelf: "flex-start",
    border: "none",
    background: "linear-gradient(135deg, #f3ecff 0%, #eadcff 100%)",
    color: "#7c3aed",
    padding: "10px 14px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "700",
  };

  return (
    <div style={pageWrapStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>Book Search</h2>
        <p style={subtitleStyle}>
          Search books with Google Books API and add the ones you like to your library.
        </p>
      </div>

      <div style={cardStyle}>
        <div
          style={{
            display: "flex",
            gap: "14px",
            flexWrap: "wrap",
            alignItems: "end",
            marginBottom: "24px",
          }}
        >
          <div style={{ flex: 1, minWidth: "260px" }}>
            <label style={labelStyle}>Search Book</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleSearchBooks();
                }
              }}
              placeholder="Search by title"
              style={inputStyle}
            />
          </div>

          <button type="button" onClick={handleSearchBooks} style={buttonStyle}>
            Search
          </button>
        </div>

        {isSearching && (
          <p style={{ color: "#7c6a96", marginBottom: "16px" }}>Searching books...</p>
        )}

        {searchError && (
          <p style={{ color: "#be185d", marginBottom: "16px" }}>{searchError}</p>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: "18px",
          }}
        >
          {searchResults.map((book) => (
            <div
              key={book.id}
              style={{
                border: "1px solid #eee5fb",
                borderRadius: "20px",
                padding: "18px",
                background: "linear-gradient(180deg, #fcfbff 0%, #f8f3ff 100%)",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                boxShadow: "0 10px 24px rgba(76, 29, 149, 0.04)",
              }}
            >
              <img
                src={book.cover}
                alt={book.title}
                style={{
                  width: "100%",
                  height: "240px",
                  objectFit: "cover",
                  borderRadius: "14px",
                }}
              />

              <div>
                <h4
                  style={{
                    margin: "0 0 8px 0",
                    fontSize: "18px",
                    color: "#24153f",
                  }}
                >
                  {book.title}
                </h4>

                <p style={{ margin: 0, color: "#7c6a96", lineHeight: "1.5" }}>
                  {book.author}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleAddSearchResultToLibrary(book)}
                style={addButtonStyle}
              >
                Add to Library
              </button>
            </div>
          ))}
        </div>

        {!isSearching && !searchError && searchResults.length === 0 && (
          <p style={{ marginTop: "20px", color: "#7c6a96" }}>
            No search results yet.
          </p>
        )}
      </div>
    </div>
  );
}

export default SearchPage;