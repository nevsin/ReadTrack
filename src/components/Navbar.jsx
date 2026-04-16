import { NavLink } from "react-router-dom";

function Navbar() {
  const navStyle = {
    backgroundColor: "#ffffff",
    border: "1px solid #dbe3f0",
    borderRadius: "16px",
    padding: "18px 24px",
    marginBottom: "24px",
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.04)",
  };

  const topRowStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "16px",
  };

  const brandStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  };

  const titleStyle = {
    margin: 0,
    fontSize: "28px",
    fontWeight: "700",
    color: "#111827",
  };

  const subtitleStyle = {
    margin: 0,
    fontSize: "13px",
    color: "#6b7280",
  };

  const navLinksStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  };

  const getLinkStyle = ({ isActive }) => ({
    textDecoration: "none",
    padding: "10px 14px",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    border: isActive ? "1px solid #2563eb" : "1px solid #dbe3f0",
    backgroundColor: isActive ? "#eff6ff" : "#f8fafc",
    color: isActive ? "#2563eb" : "#374151",
    transition: "0.2s",
  });

  return (
    <div style={navStyle}>
      <div style={topRowStyle}>
        <div style={brandStyle}>
          <h1 style={titleStyle}>ReadTrack</h1>
          <p style={subtitleStyle}>AI-Based Reading Habit Tracking System</p>
        </div>

        <div style={navLinksStyle}>
          <NavLink to="/" style={getLinkStyle}>
            Dashboard
          </NavLink>

          <NavLink to="/library" style={getLinkStyle}>
            My Library
          </NavLink>

          <NavLink to="/sessions" style={getLinkStyle}>
            Reading Sessions
          </NavLink>

          <NavLink to="/search" style={getLinkStyle}>
            Book Search
          </NavLink>

          <NavLink to="/recommendations" style={getLinkStyle}>
            Recommendations
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default Navbar;