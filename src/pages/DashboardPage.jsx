import {
  FiAward,
  FiBookOpen,
  FiCheckCircle,
  FiHeart,
  FiStar,
  FiTrendingUp,
} from "react-icons/fi";

function DashboardPage({
  stats,
  recentSessions,
  recommendations,
  yearlyBookGoal,
  goalProgress,
  goalInput,
  setGoalInput,
  handleSaveGoal,
}) {
  const theme = lightTheme;

  const safeStats = stats || [];
  const safeSessions = recentSessions || [];
  const safeRecommendations = recommendations || [];

  const completedStat = safeStats.find((stat) =>
    stat.title.toLowerCase().includes("completed")
  );

  const currentlyReadingStat = safeStats.find((stat) =>
    stat.title.toLowerCase().includes("currently")
  );

  const completedBooks = Number(completedStat?.value || 0);
  const currentlyReading = Number(currentlyReadingStat?.value || 0);

  const remainingBooks =
    yearlyBookGoal > 0 ? Math.max(yearlyBookGoal - completedBooks, 0) : 0;

  const readingStreak = calculateReadingStreak(safeSessions);

  const motivationalFeedback = generateMotivationalFeedback({
    sessions: safeSessions,
    yearlyBookGoal,
    completedBooks,
    readingStreak,
  });

  const recentReadingSessions = safeSessions
    .filter((session) => String(session.bookTitle || "").trim())
    .map((session) => ({
      title: session.bookTitle,
      pagesRead: Number(session.pagesRead || 0),
      date: session.date || "Recently",
    }))
    .slice(0, 3);

  const dashboardRecommendations = safeRecommendations
    .filter((book) => String(book.title || "").trim())
    .slice(0, 3);

  const metricCards = [
    {
      label: "Currently Reading",
      value: currentlyReading,
      icon: <FiBookOpen />,
      tone: "purple",
    },
    {
      label: "Completed",
      value: completedBooks,
      icon: <FiCheckCircle />,
      tone: "green",
    },
    {
      label: "Reading Streak",
      value: `${readingStreak} day${readingStreak === 1 ? "" : "s"}`,
      icon: <FiTrendingUp />,
      tone: "amber",
    },
  ];

  return (
    <div style={{ ...styles.page, background: theme.pageBg, color: theme.text }}>
      <div style={styles.topBar}>
        <div>
          <p style={{ ...styles.pageEyebrow, color: theme.muted }}>
            Dashboard Overview
          </p>

          <h2 style={{ ...styles.pageTitle, color: theme.text }}>
            Reading progress summary
          </h2>
        </div>
      </div>

      <section style={styles.headerGrid}>
        <div style={styles.hero}>
          <div style={styles.heroContent}>
            <p style={styles.heroEyebrow}>Reading Dashboard</p>

            <h1 style={styles.heroTitle}>
              Your reading progress, clearly organized.
            </h1>

            <p style={styles.heroText}>
              View your yearly goal, completed books, and recent reading
              activity in one simple dashboard.
            </p>
          </div>

          <div style={styles.heroDecoration}>
            <div style={styles.floatingBookOne} />
            <div style={styles.floatingBookTwo} />
            <div style={styles.floatingBookThree} />
          </div>
        </div>

        <div
          style={{
            ...styles.goalPanel,
            backgroundColor: theme.cardBg,
            border: `1px solid ${theme.border}`,
            boxShadow: theme.cardShadow,
          }}
        >
          <div style={styles.panelTop}>
            <div>
              <p style={styles.kicker}>Yearly goal</p>

              <h2 style={{ ...styles.panelTitle, color: theme.text }}>
                Progress
              </h2>
            </div>

            <span style={styles.iconCircle}>
              <FiAward />
            </span>
          </div>

          <div style={styles.goalVisualWrap}>
            <div
              style={{
                ...styles.goalRing,
                background: `conic-gradient(#7c3aed ${
                  goalProgress * 3.6
                }deg, #ede9fe 0deg)`,
              }}
            >
              <div
                style={{
                  ...styles.goalRingInner,
                  backgroundColor: theme.cardBg,
                  boxShadow: `inset 0 0 0 1px ${theme.border}`,
                }}
              >
                <FiAward style={styles.goalCupIcon} />

                <strong style={{ color: theme.text }}>{goalProgress}%</strong>

                <span style={{ color: theme.muted }}>complete</span>
              </div>
            </div>
          </div>

          <p style={{ ...styles.goalText, color: theme.muted }}>
            <strong style={{ color: theme.text }}>{completedBooks}</strong> of{" "}
            <strong style={{ color: theme.text }}>
              {yearlyBookGoal || "not set"}
            </strong>{" "}
            books completed.
            {yearlyBookGoal > 0 && <> {remainingBooks} books remaining.</>}
          </p>

          <form onSubmit={handleSaveGoal} style={styles.goalForm}>
            <input
              type="number"
              min="1"
              value={goalInput}
              onChange={(event) => setGoalInput(event.target.value)}
              placeholder="Set goal"
              style={{
                ...styles.goalInput,
                backgroundColor: theme.inputBg,
                border: `1px solid ${theme.border}`,
                color: theme.text,
              }}
            />

            <button type="submit" style={styles.saveButton}>
              Save
            </button>
          </form>
        </div>
      </section>

      <section style={styles.metricGrid}>
        {metricCards.map((metric) => (
          <MetricCard key={metric.label} metric={metric} theme={theme} />
        ))}
      </section>

      <section
        style={{
          ...styles.motivationCard,
          backgroundColor: theme.cardBg,
          border: `1px solid ${theme.border}`,
          boxShadow: theme.cardShadow,
        }}
      >
        <div style={styles.motivationLeft}>
          <span style={styles.motivationIcon}>
            <FiHeart />
          </span>

          <div>
            <p style={styles.kicker}>Reading Motivation</p>

            <h3 style={{ ...styles.motivationTitle, color: theme.text }}>
              {motivationalFeedback.title}
            </h3>

            <p style={{ ...styles.motivationText, color: theme.muted }}>
              {motivationalFeedback.message}
            </p>
          </div>
        </div>

        <span style={styles.autoTag}>Based on your activity</span>
      </section>

      <section style={styles.bottomGrid}>
        <div
          style={{
            ...styles.bottomCard,
            backgroundColor: theme.cardBg,
            border: `1px solid ${theme.border}`,
            boxShadow: theme.cardShadow,
          }}
        >
          <SectionHeader
            icon={<FiBookOpen />}
            title="Recent Reading Sessions"
            subtitle="Latest reading activity at a glance"
            theme={theme}
          />

          <div style={styles.sessionList}>
            {recentReadingSessions.map((session, index) => (
              <div
                key={`${session.title}-${session.date}-${index}`}
                style={styles.sessionRow}
              >
                <strong style={{ color: theme.text }}>{session.title}</strong>

                <span style={{ color: theme.muted }}>
                  {session.pagesRead} pages • {session.date}
                </span>
              </div>
            ))}

            {recentReadingSessions.length === 0 && (
              <p style={{ ...styles.emptyText, color: theme.muted }}>
                No reading sessions recorded yet.
              </p>
            )}
          </div>
        </div>

        <div
          style={{
            ...styles.bottomCard,
            backgroundColor: theme.cardBg,
            border: `1px solid ${theme.border}`,
            boxShadow: theme.cardShadow,
          }}
        >
          <SectionHeader
            icon={<FiStar />}
            title="Recommendations"
            subtitle="Suggested books for your profile"
            theme={theme}
          />

          <div style={styles.recommendationList}>
            {dashboardRecommendations.map((book, index) => (
              <div
                key={`${book.title}-${book.author || "author"}-${index}`}
                style={styles.recommendationRow}
              >
                <strong style={{ color: theme.text }}>{book.title}</strong>

                <span style={{ color: theme.muted }}>
                  {book.author || "Unknown Author"}
                </span>
              </div>
            ))}

            {dashboardRecommendations.length === 0 && (
              <p style={{ ...styles.emptyText, color: theme.muted }}>
                No recommendations available yet.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function generateMotivationalFeedback({
  sessions = [],
  yearlyBookGoal = 0,
  completedBooks = 0,
  readingStreak = 0,
}) {
  const lastSessionDate = getMostRecentSessionDate(sessions);

  const remainingBooks =
    yearlyBookGoal > 0 ? Math.max(yearlyBookGoal - completedBooks, 0) : 0;

  if (!lastSessionDate) {
    if (yearlyBookGoal > 0) {
      return {
        title: "Start with a small step",
        message: `Your yearly goal is set to ${yearlyBookGoal} books. Record your first reading session to begin building your reading habit.`,
      };
    }

    return {
      title: "Start with a small step",
      message:
        "Record your first reading session to begin building your reading habit.",
    };
  }

  const daysSinceLastSession = getDaysBetween(lastSessionDate, new Date());

  if (daysSinceLastSession === 0 && readingStreak >= 3) {
    return {
      title: "You are building consistency",
      message: `You recorded a session today and reached a ${readingStreak}-day reading streak. Keep the routine going.`,
    };
  }

  if (daysSinceLastSession === 0) {
    return {
      title: "Nice work today",
      message:
        "You recorded a reading session today. Consistency matters more than reading a lot at once.",
    };
  }

  if (daysSinceLastSession <= 2 && readingStreak > 0) {
    return {
      title: "Keep your rhythm",
      message:
        "You read recently. A short reading session today can help you continue your routine.",
    };
  }

  if (yearlyBookGoal > 0 && remainingBooks === 0) {
    return {
      title: "Yearly goal completed",
      message:
        "You have reached your yearly reading goal. You can continue reading or set a higher target.",
    };
  }

  if (yearlyBookGoal > 0 && remainingBooks > 0) {
    return {
      title: "Keep moving toward your goal",
      message: `You have completed ${completedBooks} of ${yearlyBookGoal} books this year. ${remainingBooks} more book${
        remainingBooks === 1 ? "" : "s"
      } to reach your goal.`,
    };
  }

  if (daysSinceLastSession >= 3) {
    return {
      title: "A short session is enough",
      message:
        "You have not recorded a session recently. Even a few pages can help you restart.",
    };
  }

  return {
    title: "Set a simple reading target",
    message:
      "You can make your reading habit easier to follow by setting a yearly goal.",
  };
}

function getMostRecentSessionDate(sessions = []) {
  const validDates = sessions
    .map((session) => getSessionDate(session))
    .filter(Boolean)
    .sort((a, b) => b.getTime() - a.getTime());

  return validDates[0] || null;
}

function getDaysBetween(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  return Math.floor((end - start) / (1000 * 60 * 60 * 24));
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

function MetricCard({ metric, theme }) {
  const tones = {
    purple: {
      bg: "#f3e8ff",
      color: "#7c3aed",
    },
    green: {
      bg: "#dcfce7",
      color: "#15803d",
    },
    amber: {
      bg: "#fef3c7",
      color: "#d97706",
    },
  };

  const tone = tones[metric.tone];

  return (
    <div
      style={{
        ...styles.metricCard,
        backgroundColor: theme.cardBg,
        border: `1px solid ${theme.border}`,
        boxShadow: theme.cardShadow,
      }}
    >
      <span
        style={{
          ...styles.metricIcon,
          backgroundColor: tone.bg,
          color: tone.color,
        }}
      >
        {metric.icon}
      </span>

      <div>
        <p style={{ ...styles.metricLabel, color: theme.muted }}>
          {metric.label}
        </p>

        <h2 style={{ ...styles.metricValue, color: theme.text }}>
          {metric.value}
        </h2>
      </div>
    </div>
  );
}

function SectionHeader({ icon, title, subtitle, theme }) {
  return (
    <div style={styles.sectionHeader}>
      <span style={styles.sectionIcon}>{icon}</span>

      <div>
        <h3 style={{ ...styles.sectionTitle, color: theme.text }}>{title}</h3>

        <p style={{ ...styles.sectionSubtitle, color: theme.muted }}>
          {subtitle}
        </p>
      </div>
    </div>
  );
}

const lightTheme = {
  pageBg:
    "radial-gradient(circle at top left, rgba(168, 85, 247, 0.12), transparent 28%), linear-gradient(135deg, #fbf9ff 0%, #f8f5ff 48%, #f3f0f8 100%)",
  cardBg: "rgba(255, 255, 255, 0.92)",
  inputBg: "#ffffff",
  text: "#111827",
  muted: "#6b7280",
  border: "rgba(124, 58, 237, 0.12)",
  cardShadow: "0 20px 50px rgba(15, 23, 42, 0.08)",
};

const styles = {
  page: {
    minHeight: "100%",
    margin: "-12px",
    padding: "22px",
    display: "flex",
    flexDirection: "column",
    gap: "22px",
    transition: "background 0.25s ease, color 0.25s ease",
  },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
  },

  pageEyebrow: {
    margin: "0 0 6px 0",
    fontSize: "12px",
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },

  pageTitle: {
    margin: 0,
    fontSize: "24px",
    letterSpacing: "-0.04em",
  },

  headerGrid: {
    display: "grid",
    gridTemplateColumns: "1.45fr 0.65fr",
    gap: "22px",
  },

  hero: {
    minHeight: "280px",
    borderRadius: "32px",
    padding: "38px",
    background:
      "radial-gradient(circle at top right, rgba(216, 180, 254, 0.55), transparent 34%), linear-gradient(135deg, #2a1647 0%, #5b21b6 55%, #a855f7 100%)",
    color: "white",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    boxShadow: "0 26px 70px rgba(91, 33, 182, 0.24)",
  },

  heroContent: {
    position: "relative",
    zIndex: 2,
    maxWidth: "720px",
  },

  heroEyebrow: {
    margin: "0 0 18px 0",
    color: "rgba(255,255,255,0.76)",
    fontSize: "13px",
    fontWeight: "900",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },

  heroTitle: {
    margin: "0 0 16px 0",
    maxWidth: "720px",
    fontSize: "54px",
    lineHeight: "1",
    letterSpacing: "-0.07em",
  },

  heroText: {
    margin: 0,
    maxWidth: "720px",
    color: "rgba(255,255,255,0.84)",
    fontSize: "16px",
    lineHeight: "1.75",
  },

  heroDecoration: {
    position: "absolute",
    right: "34px",
    top: "28px",
    bottom: "28px",
    width: "210px",
    opacity: 0.23,
    pointerEvents: "none",
  },

  floatingBookOne: {
    position: "absolute",
    right: "10px",
    top: "6px",
    width: "92px",
    height: "128px",
    borderRadius: "18px",
    border: "1px solid rgba(255,255,255,0.5)",
    backgroundColor: "rgba(255,255,255,0.13)",
    transform: "rotate(12deg)",
  },

  floatingBookTwo: {
    position: "absolute",
    right: "92px",
    top: "84px",
    width: "82px",
    height: "116px",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.45)",
    backgroundColor: "rgba(255,255,255,0.11)",
    transform: "rotate(-10deg)",
  },

  floatingBookThree: {
    position: "absolute",
    right: "22px",
    bottom: "6px",
    width: "74px",
    height: "104px",
    borderRadius: "15px",
    border: "1px solid rgba(255,255,255,0.4)",
    backgroundColor: "rgba(255,255,255,0.09)",
    transform: "rotate(4deg)",
  },

  goalPanel: {
    borderRadius: "32px",
    padding: "24px",
    transition: "background 0.25s ease, border 0.25s ease",
  },

  panelTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    alignItems: "center",
  },

  kicker: {
    margin: "0 0 6px 0",
    color: "#7c3aed",
    fontSize: "12px",
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },

  panelTitle: {
    margin: 0,
    fontSize: "24px",
    letterSpacing: "-0.04em",
  },

  iconCircle: {
    width: "46px",
    height: "46px",
    borderRadius: "16px",
    display: "grid",
    placeItems: "center",
    backgroundColor: "#f3e8ff",
    color: "#7c3aed",
    fontSize: "20px",
  },

  goalVisualWrap: {
    display: "grid",
    placeItems: "center",
    margin: "22px 0",
  },

  goalRing: {
    width: "146px",
    height: "146px",
    borderRadius: "50%",
    display: "grid",
    placeItems: "center",
  },

  goalRingInner: {
    width: "104px",
    height: "104px",
    borderRadius: "50%",
    display: "grid",
    placeItems: "center",
    alignContent: "center",
  },

  goalCupIcon: {
    color: "#7c3aed",
    fontSize: "20px",
    marginBottom: "4px",
  },

  goalText: {
    textAlign: "center",
    fontSize: "14px",
    lineHeight: "1.55",
  },

  goalForm: {
    display: "flex",
    gap: "8px",
  },

  goalInput: {
    flex: 1,
    padding: "12px",
    borderRadius: "14px",
    outline: "none",
    fontWeight: "800",
  },

  saveButton: {
    border: "none",
    borderRadius: "14px",
    padding: "0 16px",
    background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
    color: "white",
    fontWeight: "900",
    cursor: "pointer",
    boxShadow: "0 10px 22px rgba(124, 58, 237, 0.22)",
  },

  metricGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "16px",
  },

  metricCard: {
    borderRadius: "24px",
    padding: "20px",
    display: "flex",
    gap: "15px",
    alignItems: "flex-start",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },

  metricIcon: {
    width: "46px",
    height: "46px",
    borderRadius: "16px",
    display: "grid",
    placeItems: "center",
    fontSize: "18px",
    flexShrink: 0,
  },

  metricLabel: {
    margin: "0 0 8px 0",
    fontSize: "12px",
    fontWeight: "900",
  },

  metricValue: {
    margin: 0,
    fontSize: "32px",
    lineHeight: "1",
    letterSpacing: "-0.04em",
  },

  motivationCard: {
    borderRadius: "28px",
    padding: "22px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "18px",
  },

  motivationLeft: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },

  motivationIcon: {
    width: "52px",
    height: "52px",
    borderRadius: "18px",
    display: "grid",
    placeItems: "center",
    backgroundColor: "#f3e8ff",
    color: "#7c3aed",
    fontSize: "20px",
    flexShrink: 0,
  },

  motivationTitle: {
    margin: "0 0 6px 0",
    fontSize: "22px",
    letterSpacing: "-0.04em",
  },

  motivationText: {
    margin: 0,
    fontSize: "14px",
    lineHeight: "1.65",
  },

  autoTag: {
    padding: "10px 13px",
    borderRadius: "999px",
    backgroundColor: "#f3e8ff",
    color: "#7c3aed",
    fontSize: "12px",
    fontWeight: "900",
    whiteSpace: "nowrap",
  },

  bottomGrid: {
    display: "grid",
    gridTemplateColumns: "1.45fr 0.75fr",
    gap: "22px",
    alignItems: "start",
  },

  bottomCard: {
    borderRadius: "30px",
    padding: "22px",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    marginBottom: "20px",
  },

  sectionIcon: {
    width: "46px",
    height: "46px",
    borderRadius: "16px",
    display: "grid",
    placeItems: "center",
    backgroundColor: "#f3e8ff",
    color: "#7c3aed",
    fontSize: "18px",
    flexShrink: 0,
  },

  sectionTitle: {
    margin: "0 0 4px 0",
    fontSize: "20px",
    letterSpacing: "-0.035em",
  },

  sectionSubtitle: {
    margin: 0,
    fontSize: "13px",
  },

  sessionList: {
    display: "grid",
    gap: "12px",
  },

  sessionRow: {
    display: "grid",
    gap: "5px",
    paddingBottom: "12px",
    borderBottom: "1px solid rgba(124, 58, 237, 0.08)",
    fontSize: "13px",
  },

  recommendationList: {
    display: "grid",
    gap: "12px",
  },

  recommendationRow: {
    display: "grid",
    gap: "5px",
    paddingBottom: "12px",
    borderBottom: "1px solid rgba(124, 58, 237, 0.08)",
    fontSize: "13px",
  },

  emptyText: {
    margin: 0,
    fontSize: "13px",
    lineHeight: "1.6",
  },
};

export default DashboardPage;