function RecommendationsPage({
  recommendations,
  recommendationsLoading,
  onRefreshRecommendations,
  onAddRecommendationToLibrary,
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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    flexWrap: "wrap",
  };

  const headerTextWrapStyle = {
    flex: 1,
    minWidth: "280px",
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

  const refreshButtonStyle = {
    border: "none",
    background: "linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)",
    color: "#ffffff",
    padding: "12px 18px",
    borderRadius: "14px",
    cursor: recommendationsLoading ? "not-allowed" : "pointer",
    fontWeight: "700",
    fontSize: "14px",
    boxShadow: "0 12px 24px rgba(139, 92, 246, 0.18)",
    opacity: recommendationsLoading ? 0.7 : 1,
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

  const addButtonStyle = {
    marginTop: "auto",
    border: "none",
    background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
    color: "#ffffff",
    padding: "12px 14px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px",
    boxShadow: "0 10px 20px rgba(124, 58, 237, 0.16)",
  };

  return (
    <div style={pageWrapStyle}>
      <div style={headerStyle}>
        <div style={headerTextWrapStyle}>
          <h2 style={titleStyle}>Recommendations</h2>
          <p style={subtitleStyle}>
            Discover suggested books based on your library and reading profile.
          </p>
        </div>

        <button
          type="button"
          onClick={onRefreshRecommendations}
          style={refreshButtonStyle}
          disabled={recommendationsLoading}
        >
          {recommendationsLoading ? "Refreshing..." : "Refresh Recommendations"}
        </button>
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
                    color: "#9a88b3",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  {recommendation.author}
                </p>

                <button
                  type="button"
                  onClick={() => onAddRecommendationToLibrary(recommendation)}
                  style={addButtonStyle}
                >
                  Add to Library
                </button>
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