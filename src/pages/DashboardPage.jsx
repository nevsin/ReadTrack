import StatCard from "../components/StatCard";
import {
  FiArrowUpRight,
  FiBook,
  FiTarget,
  FiClock,
  FiStar,
} from "react-icons/fi";

function DashboardPage({
  stats,
  recentSessions,
  recommendations,
  yearlyBookGoal,
  goalProgress,
  sessionsLoading,
  goalInput,
  setGoalInput,
  handleSaveGoal,
}) {
  const pageWrapStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  };

  const heroStyle = {
    background: "linear-gradient(135deg, #2a1647 0%, #5b21b6 55%, #a855f7 100%)",
    borderRadius: "30px",
    padding: "32px",
    color: "white",
    boxShadow: "0 20px 45px rgba(91, 33, 182, 0.22)",
    position: "relative",
    overflow: "hidden",
  };

  const heroGlowStyle = {
    position: "absolute",
    right: "-80px",
    top: "-80px",
    width: "240px",
    height: "240px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.12)",
    filter: "blur(10px)",
  };

  const heroGridStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    flexWrap: "wrap",
    position: "relative",
    zIndex: 1,
  };

  const heroTitleStyle = {
    margin: "0 0 10px 0",
    fontSize: "38px",
    fontWeight: "800",
    letterSpacing: "-0.03em",
  };

  const heroTextStyle = {
    margin: 0,
    maxWidth: "640px",
    color: "rgba(255,255,255,0.84)",
    fontSize: "16px",
    lineHeight: "1.7",
  };

  const heroBadgeWrapStyle = {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginTop: "22px",
  };

  const heroBadgeStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 14px",
    borderRadius: "999px",
    backgroundColor: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.16)",
    fontWeight: "600",
    fontSize: "14px",
  };

  const heroMiniCardStyle = {
    width: "300px",
    maxWidth: "100%",
    backgroundColor: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.16)",
    borderRadius: "22px",
    padding: "20px",
    backdropFilter: "blur(8px)",
  };

  const heroMiniLabelStyle = {
    margin: "0 0 8px 0",
    fontSize: "13px",
    color: "rgba(255,255,255,0.75)",
  };

  const heroMiniValueStyle = {
    margin: 0,
    fontSize: "34px",
    fontWeight: "800",
  };

  const heroMiniSubStyle = {
    marginTop: "8px",
    marginBottom: 0,
    color: "rgba(255,255,255,0.75)",
    fontSize: "14px",
  };

  const heroProgressOuterStyle = {
    height: "10px",
    borderRadius: "999px",
    backgroundColor: "rgba(255,255,255,0.18)",
    overflow: "hidden",
    marginTop: "16px",
  };

  const heroProgressInnerStyle = {
    width: `${goalProgress}%`,
    height: "100%",
    borderRadius: "999px",
    background: "linear-gradient(90deg, #ffffff 0%, #f5d0fe 100%)",
  };

  const heroGoalFormStyle = {
    display: "flex",
    gap: "10px",
    marginTop: "16px",
    flexWrap: "wrap",
  };

  const heroGoalInputStyle = {
    flex: 1,
    minWidth: "120px",
    padding: "12px 14px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.18)",
    backgroundColor: "rgba(255,255,255,0.14)",
    color: "#ffffff",
    fontSize: "14px",
    outline: "none",
  };

  const heroGoalButtonStyle = {
    border: "none",
    background: "#ffffff",
    color: "#6d28d9",
    padding: "12px 16px",
    borderRadius: "14px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px",
  };

  const sectionTitleStyle = {
    margin: 0,
    fontSize: "30px",
    color: "#24153f",
    fontWeight: "800",
    letterSpacing: "-0.03em",
  };

  const sectionTextStyle = {
    margin: "8px 0 0 0",
    color: "#7c6a96",
    fontSize: "15px",
    lineHeight: "1.6",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "24px",
  };

  const cardStyle = {
    backgroundColor: "rgba(255,255,255,0.82)",
    backdropFilter: "blur(8px)",
    borderRadius: "28px",
    padding: "26px",
    border: "1px solid #eee5fb",
    boxShadow: "0 18px 40px rgba(76, 29, 149, 0.06)",
  };

  const cardHeaderStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    marginBottom: "18px",
  };

  const cardTitleStyle = {
    margin: 0,
    fontSize: "22px",
    color: "#24153f",
    fontWeight: "800",
  };

  const cardSubStyle = {
    margin: "6px 0 0 0",
    color: "#7c6a96",
    fontSize: "14px",
  };

  const iconBoxStyle = {
    width: "42px",
    height: "42px",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #f3ecff 0%, #e9dcff 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#7c3aed",
  };

  const sessionItemStyle = {
    padding: "16px 0",
    borderBottom: "1px solid #eee5fb",
  };

  const recommendationItemStyle = {
    padding: "14px 16px",
    borderRadius: "18px",
    background: "#fbf8ff",
    border: "1px solid #eee5fb",
    marginBottom: "12px",
  };

  const safeGoalText = yearlyBookGoal > 0 ? yearlyBookGoal : "Not set";

  return (
    <div style={pageWrapStyle}>
      <section style={heroStyle}>
        <div style={heroGlowStyle} />

        <div style={heroGridStyle}>
          <div>
            <h2 style={heroTitleStyle}>Track Your Reading Journey</h2>
            <p style={heroTextStyle}>
              Set your yearly goal, manage your library, and follow your reading
              progress in one place.
            </p>

            <div style={heroBadgeWrapStyle}>
              <div style={heroBadgeStyle}>
                <FiBook />
                Reading Tracking
              </div>
              <div style={heroBadgeStyle}>
                <FiTarget />
                Goal Progress
              </div>
              <div style={heroBadgeStyle}>
                <FiClock />
                Session History
              </div>
            </div>
          </div>

          <div style={heroMiniCardStyle}>
            <p style={heroMiniLabelStyle}>Yearly Goal Progress</p>
            <h3 style={heroMiniValueStyle}>{goalProgress}%</h3>
            <p style={heroMiniSubStyle}>Target: {safeGoalText} books this year</p>

            <div style={heroProgressOuterStyle}>
              <div style={heroProgressInnerStyle} />
            </div>

            <form onSubmit={handleSaveGoal} style={heroGoalFormStyle}>
              <input
                type="number"
                min="1"
                value={goalInput}
                onChange={(event) => setGoalInput(event.target.value)}
                placeholder="Set yearly goal"
                style={heroGoalInputStyle}
              />
              <button type="submit" style={heroGoalButtonStyle}>
                Save
              </button>
            </form>
          </div>
        </div>
      </section>

      <section>
        <h2 style={sectionTitleStyle}>Overview</h2>
        <p style={sectionTextStyle}>
          A quick snapshot of your reading activity and current progress.
        </p>

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
      </section>

      <section style={gridStyle}>
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <div>
              <h3 style={cardTitleStyle}>Recent Reading Sessions</h3>
              <p style={cardSubStyle}>
                Your latest reading activity at a glance
              </p>
            </div>
            <div style={iconBoxStyle}>
              <FiArrowUpRight size={18} />
            </div>
          </div>

          {sessionsLoading && (
            <p style={{ margin: 0, color: "#7c6a96" }}>
              Loading reading sessions...
            </p>
          )}

          {!sessionsLoading &&
            recentSessions.slice(0, 4).map((session, index) => (
              <div
                key={session.id}
                style={{
                  ...sessionItemStyle,
                  borderBottom:
                    index === Math.min(recentSessions.length, 4) - 1
                      ? "none"
                      : "1px solid #eee5fb",
                }}
              >
                <strong style={{ color: "#24153f", fontSize: "16px" }}>
                  {session.bookTitle}
                </strong>
                <p style={{ margin: "8px 0 0 0", color: "#7c6a96" }}>
                  {session.duration} minutes • {session.pagesRead || 0} pages •{" "}
                  {session.date}
                </p>
              </div>
            ))}

          {!sessionsLoading && recentSessions.length === 0 && (
            <p style={{ margin: 0, color: "#7c6a96" }}>
              No reading sessions yet.
            </p>
          )}
        </div>

        <div>
          <div style={cardStyle}>
            <div style={cardHeaderStyle}>
              <div>
                <h3 style={cardTitleStyle}>Recommendations</h3>
                <p style={cardSubStyle}>Suggested books for your profile</p>
              </div>
              <div style={iconBoxStyle}>
                <FiStar size={18} />
              </div>
            </div>

            {recommendations.slice(0, 5).map((recommendation) => (
              <div key={recommendation.id} style={recommendationItemStyle}>
                <strong style={{ color: "#24153f", display: "block" }}>
                  {recommendation.title}
                </strong>
                <p
                  style={{
                    margin: "8px 0 0 0",
                    color: "#7c6a96",
                    lineHeight: "1.5",
                    fontSize: "14px",
                  }}
                >
                  {recommendation.author}
                </p>
              </div>
            ))}

            {recommendations.length === 0 && (
              <p style={{ margin: 0, color: "#7c6a96" }}>
                No recommendations available yet.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;