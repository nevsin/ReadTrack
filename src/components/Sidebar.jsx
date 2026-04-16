import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiBookOpen,
  FiClock,
  FiSearch,
  FiStar,
} from "react-icons/fi";

function Sidebar() {
  const sidebarStyle = {
    width: "280px",
    minHeight: "calc(100vh - 48px)",
    background: "linear-gradient(180deg, #ffffff 0%, #faf7ff 100%)",
    border: "1px solid #eadffc",
    borderRadius: "28px",
    padding: "24px",
    boxShadow: "0 20px 45px rgba(91, 33, 182, 0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    position: "sticky",
    top: "24px",
  };

  const brandWrapStyle = {
    paddingBottom: "8px",
    borderBottom: "1px solid #efe7fb",
  };

  const logoStyle = {
    width: "52px",
    height: "52px",
    borderRadius: "16px",
    background: "linear-gradient(135deg, #8b5cf6 0%, #c084fc 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "22px",
    fontWeight: "700",
    marginBottom: "14px",
    boxShadow: "0 12px 24px rgba(139, 92, 246, 0.25)",
  };

  const titleStyle = {
    margin: "0 0 6px 0",
    fontSize: "30px",
    fontWeight: "800",
    color: "#24153f",
    letterSpacing: "-0.03em",
  };

  const subtitleStyle = {
    margin: 0,
    color: "#73648a",
    fontSize: "14px",
    lineHeight: "1.6",
  };

  const navSectionStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  };

  const sectionLabelStyle = {
    margin: "0 0 4px 4px",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#a08bbd",
  };

  const getLinkStyle = ({ isActive }) => ({
    display: "flex",
    alignItems: "center",
    gap: "12px",
    textDecoration: "none",
    padding: "14px 16px",
    borderRadius: "16px",
    fontSize: "15px",
    fontWeight: "700",
    background: isActive
      ? "linear-gradient(135deg, #f3ecff 0%, #eadcff 100%)"
      : "transparent",
    color: isActive ? "#7c3aed" : "#3e3357",
    border: isActive ? "1px solid #dccbff" : "1px solid transparent",
    boxShadow: isActive ? "0 10px 20px rgba(139, 92, 246, 0.10)" : "none",
    transition: "all 0.2s ease",
  });

  const footerCardStyle = {
    marginTop: "auto",
    padding: "18px",
    borderRadius: "20px",
    background: "linear-gradient(135deg, #f6f0ff 0%, #fcfaff 100%)",
    border: "1px solid #e9dcff",
  };

  const footerTitleStyle = {
    margin: "0 0 8px 0",
    fontSize: "16px",
    fontWeight: "700",
    color: "#24153f",
  };

  const footerTextStyle = {
    margin: 0,
    color: "#73648a",
    fontSize: "14px",
    lineHeight: "1.6",
  };

  return (
    <aside style={sidebarStyle}>
      <div style={brandWrapStyle}>
        <div style={logoStyle}>R</div>
        <h1 style={titleStyle}>ReadTrack</h1>
        <p style={subtitleStyle}>
          AI-Based Reading Habit Tracking and Recommendation System
        </p>
      </div>

      <div style={navSectionStyle}>
        <p style={sectionLabelStyle}>Navigation</p>

        <NavLink to="/" style={getLinkStyle}>
          <FiHome size={18} />
          Dashboard
        </NavLink>

        <NavLink to="/library" style={getLinkStyle}>
          <FiBookOpen size={18} />
          My Library
        </NavLink>

        <NavLink to="/sessions" style={getLinkStyle}>
          <FiClock size={18} />
          Reading Sessions
        </NavLink>

        <NavLink to="/search" style={getLinkStyle}>
          <FiSearch size={18} />
          Book Search
        </NavLink>

        <NavLink to="/recommendations" style={getLinkStyle}>
          <FiStar size={18} />
          Recommendations
        </NavLink>
      </div>

      <div style={footerCardStyle}>
        <h3 style={footerTitleStyle}>Reading Goal</h3>
        <p style={footerTextStyle}>
          Keep your reading habit organized, measurable, and easier to improve.
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;