function RecommendationsPage({
  recommendations,
  yearlyBookGoal,
  goalProgress,
  recommendationsLoading,
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

  const topGridStyle = {
    display: "grid",
    gridTemplateColumns: "1.2fr 2fr",
    gap: "20px",
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

  const smallLabelStyle = {
    margin: 0,
    fontSize: "13px",
    fontWeight: "700",
    color: "#8f7aa9",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  };

  const bigValueStyle = {
    margin: "10px 0 8px 0",
    fontSize: "44px",
    color: "#7c3aed",
    fontWeight: "800",
    lineHeight: "1",
  };

  const helperTextStyle = {
    margin: 0,
    color: "#7c6a96",
    fontSize: "15px",
    lineHeight: "1.6",
  };

  const progressOuterStyle = {
    height: "12px",
    borderRadius: "999px",
    backgroundColor: "#eadcff",
    overflow: "hidden",
    marginTop: "18px",
  };

  const progressInnerStyle = {
    width: `${goalProgress}%`,
    height: "100%",
    borderRadius: "999px",
    background: "linear-gradient(90deg, #8b5cf6 0%, #c084fc 100%)",
  };

  const recommendationGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "18px",
  };

  const recommendationCardStyle = {
    border: "1px solid #eee5fb",
    borderRadius: "20px",
    padding: "20px",
    background: "linear-gradient(180deg, #fcfbff 0%, #f8f3ff 100%)",
    boxShadow: "0 10px 24px rgba(76, 29, 149, 0.04)",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  };

  const badgeStyle = {
    display: "inline-block",
    alignSelf: "flex-start",
    padding: "7px 12px",
    borderRadius: "999px",
    background: "linear-gradient(135deg, #f3ecff 0%, #eadcff 100%)",
    color: "#7c3aed",
    fontSize: "12px",
    fontWeight: "700",
  };

  return (
    <div style={pageWrapStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>Recommendations</h2>
        <p style={subtitleStyle}>
          Discover suggested books based on your reading activity and current
          progress.
        </p>
      </div>

      <div style={topGridStyle}>
        <div style={cardStyle}>
          <p style={smallLabelStyle}>Goal Progress</p>
          <h3 style={bigValueStyle}>{goalProgress}%</h3>
          <p style={helperTextStyle}>
            You are working toward your yearly target of {yearlyBookGoal} books.
          </p>

          <div style={progressOuterStyle}>
            <div style={progressInnerStyle} />
          </div>

          <p
            style={{
              margin: "14px 0 0 0",
              color: "#7c3aed",
              fontWeight: "700",
              fontSize: "14px",
            }}
          >
            {goalProgress}% completed
          </p>
        </div>

        <div style={cardStyle}>
          <h3 style={sectionTitleStyle}>Recommendation Notes</h3>
          <p style={helperTextStyle}>
            These suggestions are generated from your reading library and reading
            status. The system uses your saved books to find similar titles and
            show more relevant recommendations.
          </p>
        </div>
      </div>

      <div style={cardStyle}>
        <h3 style={sectionTitleStyle}>Suggested Books</h3>

        {recommendationsLoading && (
          <p style={{ margin: 0, color: "#7c6a96" }}>
            Loading recommendations...
          </p>
        )}

        {!recommendationsLoading && (
          <div style={recommendationGridStyle}>
            {recommendations.map((recommendation) => (
              <div key={recommendation.id} style={recommendationCardStyle}>
                <span style={badgeStyle}>Recommended</span>

                {recommendation.cover && (
                  <img
                    src={recommendation.cover}
                    alt={recommendation.title}
                    style={{
                      width: "100%",
                      height: "240px",
                      objectFit: "cover",
                      borderRadius: "14px",
                    }}
                  />
                )}

                <h4
                  style={{
                    margin: 0,
                    fontSize: "20px",
                    color: "#24153f",
                    lineHeight: "1.4",
                  }}
                >
                  {recommendation.title}
                </h4>

                <p
                  style={{
                    margin: 0,
                    color: "#7c6a96",
                    lineHeight: "1.7",
                    fontSize: "15px",
                  }}
                >
                  {recommendation.reason}
                </p>

                <p
                  style={{
                    margin: 0,
                    color: "#9a88b3",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  {recommendation.author}
                </p>
              </div>
            ))}
          </div>
        )}

        {!recommendationsLoading && recommendations.length === 0 && (
          <p style={{ marginTop: "20px", color: "#7c6a96" }}>
            No recommendations available yet.
          </p>
        )}
      </div>
    </div>
  );
}

export default RecommendationsPage;