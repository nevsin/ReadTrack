function StatCard({ title, value, icon }) {
  const cardStyle = {
    flex: "1 1 240px",
    minWidth: "220px",
    background: "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(250,247,255,0.96) 100%)",
    borderRadius: "24px",
    padding: "22px",
    border: "1px solid #eee5fb",
    boxShadow: "0 18px 36px rgba(76, 29, 149, 0.06)",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  };

  const topStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const iconWrapStyle = {
    width: "48px",
    height: "48px",
    borderRadius: "16px",
    background: "linear-gradient(135deg, #f3ecff 0%, #e9dcff 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#7c3aed",
    fontSize: "18px",
  };

  const titleStyle = {
    margin: 0,
    fontSize: "14px",
    fontWeight: "700",
    color: "#7c6a96",
  };

  const valueStyle = {
    margin: 0,
    fontSize: "34px",
    fontWeight: "800",
    color: "#24153f",
    letterSpacing: "-0.03em",
  };

  return (
    <div style={cardStyle}>
      <div style={topStyle}>
        <p style={titleStyle}>{title}</p>
        <div style={iconWrapStyle}>{icon}</div>
      </div>

      <h3 style={valueStyle}>{value}</h3>
    </div>
  );
}

export default StatCard;