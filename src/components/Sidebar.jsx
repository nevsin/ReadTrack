import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiBookOpen,
  FiClock,
  FiSearch,
  FiStar,
} from "react-icons/fi";
import ReadTrackLogo from "./ReadTrackLogo";

function Sidebar() {
  const sidebarStyle = {
    width: "280px",
    minHeight: "calc(100vh - 48px)",
    background: "linear-gradient(180deg, #ffffff 0%, #faf7ff 100%)",
    border: "1px solid #eadffc",
    borderRadius: "28px",
    padding: "26px 24px",
    boxShadow: "0 20px 45px rgba(91, 33, 182, 0.08)",
    display: "flex",
    flexDirection: "column",
    position: "sticky",
    top: "24px",
  };

  const brandWrapStyle = {
    paddingBottom: "18px",
    borderBottom: "1px solid #efe7fb",
    marginBottom: "26px",
  };

  const navSectionStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  };

  const sectionLabelStyle = {
    margin: "0 0 8px 4px",
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
    padding: "15px 16px",
    borderRadius: "18px",
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

  const spacerStyle = {
    flex: 1,
    minHeight: "140px",
  };

  return (
    <aside style={sidebarStyle}>
      <div style={brandWrapStyle}>
        <ReadTrackLogo size={66} stacked />
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

      <div style={spacerStyle} />
    </aside>
  );
}

export default Sidebar;