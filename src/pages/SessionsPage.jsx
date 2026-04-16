function SessionsPage({
  recentSessions,
  bookTitle,
  setBookTitle,
  duration,
  setDuration,
  handleAddSession,
  handleDeleteSession,
  sessionsLoading,
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
    border: "none",
    backgroundColor: "#fce7f3",
    color: "#be185d",
    padding: "10px 14px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "700",
  };

  const sessionItemStyle = {
    padding: "18px 0",
    borderBottom: "1px solid #eee5fb",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
  };

  return (
    <div style={pageWrapStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>Reading Sessions</h2>
        <p style={subtitleStyle}>
          Log your reading activity and keep a clean history of your recent sessions.
        </p>
      </div>

      <div style={cardStyle}>
        <h3 style={sectionTitleStyle}>Log Reading Session</h3>

        <form
          onSubmit={handleAddSession}
          style={{
            display: "flex",
            gap: "14px",
            flexWrap: "wrap",
            alignItems: "end",
          }}
        >
          <div style={{ flex: 2, minWidth: "240px" }}>
            <label style={labelStyle}>Book Title</label>
            <input
              type="text"
              value={bookTitle}
              onChange={(event) => setBookTitle(event.target.value)}
              placeholder="Enter book name"
              style={inputStyle}
            />
          </div>

          <div style={{ flex: 1, minWidth: "180px" }}>
            <label style={labelStyle}>Duration (min)</label>
            <input
              type="number"
              min="1"
              value={duration}
              onChange={(event) => setDuration(event.target.value)}
              placeholder="30"
              style={inputStyle}
            />
          </div>

          <button type="submit" style={buttonStyle}>
            Add Session
          </button>
        </form>
      </div>

      <div style={cardStyle}>
        <h3 style={sectionTitleStyle}>Recent Reading Sessions</h3>

        {sessionsLoading && (
          <p style={{ margin: 0, color: "#7c6a96" }}>
            Loading reading sessions...
          </p>
        )}

        {!sessionsLoading &&
          recentSessions.map((session, index) => (
            <div
              key={session.id}
              style={{
                ...sessionItemStyle,
                borderBottom:
                  index === recentSessions.length - 1
                    ? "none"
                    : "1px solid #eee5fb",
              }}
            >
              <div>
                <strong style={{ color: "#24153f", fontSize: "17px" }}>
                  {session.bookTitle}
                </strong>
                <p
                  style={{
                    margin: "8px 0 0 0",
                    color: "#7c6a96",
                    fontSize: "15px",
                  }}
                >
                  {session.duration} minutes • {session.date}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleDeleteSession(session.id)}
                style={deleteButtonStyle}
              >
                Delete
              </button>
            </div>
          ))}

        {!sessionsLoading && recentSessions.length === 0 && (
          <p style={{ margin: 0, color: "#7c6a96" }}>
            No reading sessions yet.
          </p>
        )}
      </div>
    </div>
  );
}

export default SessionsPage;