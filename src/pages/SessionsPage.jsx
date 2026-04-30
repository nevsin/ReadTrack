import {
  FiBookOpen,
  FiCalendar,
  FiCheckCircle,
  FiRefreshCw,
  FiShield,
  FiTrash2,
  FiZap,
} from "react-icons/fi";

function SessionsPage({
  recentSessions,
  libraryBooks,
  bookTitle,
  setBookTitle,
  pagesRead,
  setPagesRead,
  handleAddSession,
  handleDeleteSession,
  sessionsLoading,
}) {
  const safeSessions = recentSessions || [];
  const readingStreak = calculateReadingStreak(safeSessions);
  const totalPages = safeSessions.reduce(
    (total, session) => total + Number(session.pagesRead || 0),
    0
  );

  const selectableBooks = libraryBooks.filter(
    (book) => book.status === "Reading"
  );

  const latestSessionDate = safeSessions[0]?.date || "No session yet";

  return (
    <div style={styles.pageWrap}>
      <div style={styles.header}>
        <div>
          <p style={styles.eyebrow}>Reading Tracker</p>

          <h2 style={styles.title}>Reading Sessions</h2>

          <p style={styles.subtitle}>
            Record your reading progress, follow your streak, and keep your
            session history organized.
          </p>
        </div>
      </div>

      <section style={styles.streakSection}>
        <div style={styles.streakHero}>
          <div style={styles.streakTop}>
            <span style={styles.streakIcon}>
              <FiZap />
            </span>

            <span style={styles.streakBadge}>Active habit tracker</span>
          </div>

          <div>
            <p style={styles.streakLabel}>Current Reading Streak</p>

            <h2 style={styles.streakNumber}>
              {readingStreak}
              <span> day{readingStreak === 1 ? "" : "s"}</span>
            </h2>

            <p style={styles.streakText}>
              Your streak grows when you record reading activity on consistent
              days.
            </p>
          </div>

          <div style={styles.streakStats}>
            <div style={styles.streakStatBox}>
              <span>Total pages</span>
              <strong>{totalPages}</strong>
            </div>

            <div style={styles.streakStatBox}>
              <span>Latest record</span>
              <strong>{latestSessionDate}</strong>
            </div>
          </div>

          <div style={styles.glowOne} />
          <div style={styles.glowTwo} />
        </div>

        <div style={styles.rulesPanel}>
          <div style={styles.rulesHeader}>
            <span style={styles.rulesIcon}>
              <FiShield />
            </span>

            <div>
              <h3 style={styles.rulesTitle}>Streak Rules</h3>
              <p style={styles.rulesSubtitle}>
                Simple rules for keeping your reading habit alive.
              </p>
            </div>
          </div>

          <div style={styles.ruleGrid}>
            <RuleCard
              icon={<FiCheckCircle />}
              title="Log once"
              text="One reading session is enough to count the day."
            />

            <RuleCard
              icon={<FiCalendar />}
              title="Read consistently"
              text="Consecutive reading days increase your streak."
            />

            <RuleCard
              icon={<FiRefreshCw />}
              title="Grace day"
              text="You get one missed day before the streak resets."
            />

            <RuleCard
              icon={<FiZap />}
              title="Reset rule"
              text="Missing two days in a row resets the streak."
            />
          </div>
        </div>
      </section>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <span style={styles.cardIcon}>
            <FiBookOpen />
          </span>

          <div>
            <h3 style={styles.sectionTitle}>Log Reading Session</h3>
            <p style={styles.sectionSubtitle}>
              Choose a currently reading book and enter the number of pages you
              read.
            </p>
          </div>
        </div>

        <form onSubmit={handleAddSession} style={styles.form}>
          <div style={{ flex: 2, minWidth: "260px" }}>
            <label style={styles.label}>Select Book</label>

            <select
              value={bookTitle}
              onChange={(event) => setBookTitle(event.target.value)}
              style={styles.input}
            >
              <option value="">Choose a book from your library</option>

              {selectableBooks.map((book) => (
                <option key={book.id} value={book.title}>
                  {book.title} — {book.author}
                </option>
              ))}
            </select>
          </div>

          <div style={{ flex: 1, minWidth: "180px" }}>
            <label style={styles.label}>Pages Read</label>

            <input
              type="number"
              min="1"
              value={pagesRead}
              onChange={(event) => setPagesRead(event.target.value)}
              placeholder="15"
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.button}>
            Add Session
          </button>
        </form>

        {selectableBooks.length === 0 && (
          <p style={styles.helperText}>
            Mark a book as Reading in your library to log a session for it.
          </p>
        )}
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <span style={styles.cardIcon}>
            <FiCalendar />
          </span>

          <div>
            <h3 style={styles.sectionTitle}>Recent Reading Sessions</h3>
            <p style={styles.sectionSubtitle}>
              Your latest page-based reading records.
            </p>
          </div>
        </div>

        {sessionsLoading && (
          <p style={styles.emptyText}>Loading reading sessions...</p>
        )}

        {!sessionsLoading && (
          <div style={styles.sessionList}>
            {safeSessions.map((session) => (
              <div key={session.id} style={styles.sessionItem}>
                <div style={styles.sessionLeft}>
                  <div style={styles.sessionDot} />

                  <div>
                    <strong style={styles.sessionTitle}>
                      {session.bookTitle}
                    </strong>

                    <p style={styles.sessionMeta}>
                      {session.pagesRead
                        ? `${session.pagesRead} pages`
                        : "0 pages"}
                      {" • "}
                      {session.date}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteSession(session.id)}
                  style={styles.deleteButton}
                >
                  <FiTrash2 />
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

        {!sessionsLoading && safeSessions.length === 0 && (
          <p style={styles.emptyText}>No reading sessions yet.</p>
        )}
      </div>
    </div>
  );
}

function RuleCard({ icon, title, text }) {
  return (
    <div style={styles.ruleCard}>
      <span style={styles.ruleIcon}>{icon}</span>

      <div>
        <strong style={styles.ruleCardTitle}>{title}</strong>
        <p style={styles.ruleCardText}>{text}</p>
      </div>
    </div>
  );
}

function calculateReadingStreak(sessions = []) {
  const readingDays = new Set();

  sessions.forEach((session) => {
    const sessionDate = getSessionDate(session);

    if (sessionDate) {
      readingDays.add(getDateKey(sessionDate));
    }
  });

  let streak = 0;
  let missedDays = 0;

  for (let dayOffset = 0; dayOffset < 365; dayOffset += 1) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - dayOffset);

    const dateKey = getDateKey(date);

    if (readingDays.has(dateKey)) {
      streak += 1;
      continue;
    }

    if (missedDays < 1) {
      missedDays += 1;
      continue;
    }

    break;
  }

  return streak;
}

function getSessionDate(session) {
  if (session?.createdAt?.toDate) {
    return session.createdAt.toDate();
  }

  if (session?.date === "Today") {
    return new Date();
  }

  if (typeof session?.date === "string" && session.date.includes("/")) {
    const [day, month, year] = session.date.split("/").map(Number);

    if (day && month && year) {
      return new Date(year, month - 1, day);
    }
  }

  return null;
}

function getDateKey(date) {
  const localDate = new Date(date);
  localDate.setHours(0, 0, 0, 0);

  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, "0");
  const day = String(localDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const styles = {
  pageWrap: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },

  header: {
    background:
      "radial-gradient(circle at top right, rgba(168,85,247,0.12), transparent 34%), linear-gradient(135deg, #ffffff 0%, #faf7ff 100%)",
    border: "1px solid #eee5fb",
    borderRadius: "30px",
    padding: "32px",
    boxShadow: "0 18px 40px rgba(76, 29, 149, 0.05)",
  },

  eyebrow: {
    margin: "0 0 8px 0",
    color: "#8b5cf6",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontWeight: "900",
  },

  title: {
    margin: "0 0 10px 0",
    fontSize: "34px",
    color: "#24153f",
    fontWeight: "800",
    letterSpacing: "-0.04em",
  },

  subtitle: {
    margin: 0,
    color: "#7c6a96",
    fontSize: "16px",
    lineHeight: "1.6",
  },

  streakSection: {
    display: "grid",
    gridTemplateColumns: "0.92fr 1.08fr",
    gap: "22px",
    alignItems: "stretch",
  },

  streakHero: {
    position: "relative",
    overflow: "hidden",
    borderRadius: "30px",
    padding: "28px",
    minHeight: "250px",
    background:
      "radial-gradient(circle at 85% 15%, rgba(255,255,255,0.25), transparent 28%), linear-gradient(135deg, #2a1647 0%, #6d28d9 55%, #a855f7 100%)",
    boxShadow: "0 24px 60px rgba(91, 33, 182, 0.24)",
    color: "#ffffff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: "22px",
  },

  streakTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    position: "relative",
    zIndex: 2,
  },

  streakIcon: {
    width: "46px",
    height: "46px",
    borderRadius: "16px",
    display: "grid",
    placeItems: "center",
    backgroundColor: "rgba(255,255,255,0.16)",
    border: "1px solid rgba(255,255,255,0.18)",
    fontSize: "20px",
  },

  streakBadge: {
    padding: "8px 12px",
    borderRadius: "999px",
    backgroundColor: "rgba(255,255,255,0.14)",
    border: "1px solid rgba(255,255,255,0.16)",
    fontSize: "12px",
    fontWeight: "800",
  },

  streakLabel: {
    margin: "0 0 8px 0",
    color: "rgba(255,255,255,0.76)",
    fontSize: "13px",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontWeight: "900",
    position: "relative",
    zIndex: 2,
  },

  streakNumber: {
    margin: 0,
    fontSize: "58px",
    lineHeight: "1",
    letterSpacing: "-0.06em",
    position: "relative",
    zIndex: 2,
  },

  streakText: {
    margin: "12px 0 0 0",
    maxWidth: "430px",
    color: "rgba(255,255,255,0.82)",
    lineHeight: "1.65",
    fontSize: "14px",
    position: "relative",
    zIndex: 2,
  },

  streakStats: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    position: "relative",
    zIndex: 2,
  },

  streakStatBox: {
    padding: "14px",
    borderRadius: "18px",
    backgroundColor: "rgba(255,255,255,0.13)",
    border: "1px solid rgba(255,255,255,0.16)",
    display: "grid",
    gap: "5px",
  },

  glowOne: {
    position: "absolute",
    right: "-50px",
    bottom: "-70px",
    width: "190px",
    height: "190px",
    borderRadius: "50%",
    backgroundColor: "rgba(255,255,255,0.13)",
  },

  glowTwo: {
    position: "absolute",
    right: "80px",
    top: "92px",
    width: "100px",
    height: "100px",
    borderRadius: "28px",
    border: "1px solid rgba(255,255,255,0.18)",
    transform: "rotate(12deg)",
  },

  rulesPanel: {
    borderRadius: "30px",
    padding: "26px",
    border: "1px solid #eee5fb",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(250,247,255,0.98) 100%)",
    boxShadow: "0 18px 36px rgba(76, 29, 149, 0.06)",
  },

  rulesHeader: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "18px",
  },

  rulesIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "17px",
    display: "grid",
    placeItems: "center",
    backgroundColor: "#f3e8ff",
    color: "#7c3aed",
    fontSize: "20px",
    flexShrink: 0,
  },

  rulesTitle: {
    margin: "0 0 4px 0",
    color: "#24153f",
    fontSize: "22px",
    fontWeight: "800",
    letterSpacing: "-0.03em",
  },

  rulesSubtitle: {
    margin: 0,
    color: "#7c6a96",
    fontSize: "14px",
    lineHeight: "1.5",
  },

  ruleGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },

  ruleCard: {
    display: "flex",
    alignItems: "flex-start",
    gap: "11px",
    padding: "14px",
    borderRadius: "18px",
    backgroundColor: "#fcfbff",
    border: "1px solid #eadffc",
  },

  ruleIcon: {
    width: "32px",
    height: "32px",
    borderRadius: "12px",
    display: "grid",
    placeItems: "center",
    backgroundColor: "#f3e8ff",
    color: "#7c3aed",
    flexShrink: 0,
  },

  ruleCardTitle: {
    display: "block",
    color: "#24153f",
    fontSize: "14px",
    marginBottom: "4px",
  },

  ruleCardText: {
    margin: 0,
    color: "#7c6a96",
    fontSize: "13px",
    lineHeight: "1.5",
  },

  card: {
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.94) 0%, rgba(250,247,255,0.98) 100%)",
    borderRadius: "28px",
    padding: "28px",
    border: "1px solid #eee5fb",
    boxShadow: "0 18px 36px rgba(76, 29, 149, 0.06)",
  },

  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "22px",
  },

  cardIcon: {
    width: "46px",
    height: "46px",
    borderRadius: "16px",
    display: "grid",
    placeItems: "center",
    backgroundColor: "#f3e8ff",
    color: "#7c3aed",
    fontSize: "19px",
    flexShrink: 0,
  },

  sectionTitle: {
    margin: "0 0 4px 0",
    fontSize: "24px",
    color: "#24153f",
    fontWeight: "800",
    letterSpacing: "-0.035em",
  },

  sectionSubtitle: {
    margin: 0,
    color: "#7c6a96",
    fontSize: "14px",
    lineHeight: "1.5",
  },

  form: {
    display: "flex",
    gap: "14px",
    flexWrap: "wrap",
    alignItems: "end",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "700",
    color: "#6f5f88",
  },

  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "15px",
    border: "1px solid #ddd1f7",
    fontSize: "15px",
    backgroundColor: "#fcfbff",
    color: "#24153f",
    boxSizing: "border-box",
  },

  button: {
    padding: "14px 22px",
    borderRadius: "15px",
    border: "none",
    background: "linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)",
    color: "white",
    fontSize: "15px",
    fontWeight: "800",
    cursor: "pointer",
    height: "50px",
    boxShadow: "0 12px 24px rgba(139, 92, 246, 0.22)",
  },

  helperText: {
    margin: "14px 0 0 0",
    color: "#7c6a96",
    fontSize: "14px",
  },

  sessionList: {
    display: "grid",
    gap: "12px",
  },

  sessionItem: {
    padding: "16px",
    border: "1px solid #eee5fb",
    backgroundColor: "#fcfbff",
    borderRadius: "18px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
  },

  sessionLeft: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
  },

  sessionDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)",
    boxShadow: "0 0 0 6px rgba(139, 92, 246, 0.12)",
    flexShrink: 0,
  },

  sessionTitle: {
    color: "#24153f",
    fontSize: "16px",
  },

  sessionMeta: {
    margin: "6px 0 0 0",
    color: "#7c6a96",
    fontSize: "14px",
  },

  deleteButton: {
    border: "none",
    backgroundColor: "#fce7f3",
    color: "#be185d",
    padding: "10px 14px",
    borderRadius: "13px",
    cursor: "pointer",
    fontWeight: "800",
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
    flexShrink: 0,
  },

  emptyText: {
    margin: 0,
    color: "#7c6a96",
    fontSize: "14px",
    lineHeight: "1.6",
  },
};

export default SessionsPage;