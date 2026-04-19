function ReadTrackLogo({ size = 72, showText = true, stacked = false }) {
  const iconSize = size;
  const titleSize = stacked ? Math.max(24, size * 0.42) : Math.max(22, size * 0.36);
  const subtitleSize = stacked ? Math.max(11, size * 0.16) : Math.max(10, size * 0.14);

  const wrapperStyle = {
    display: "flex",
    flexDirection: stacked ? "column" : "row",
    alignItems: stacked ? "flex-start" : "center",
    gap: "14px",
  };

  const iconWrapStyle = {
    width: `${iconSize}px`,
    height: `${iconSize}px`,
    borderRadius: `${Math.round(iconSize * 0.28)}px`,
    background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 55%, #c084fc 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 16px 30px rgba(139, 92, 246, 0.28)",
    flexShrink: 0,
  };

  const titleStyle = {
    margin: 0,
    fontSize: `${titleSize}px`,
    lineHeight: 1,
    fontWeight: "800",
    letterSpacing: "-0.03em",
    color: "#24153f",
  };

  const subtitleStyle = {
    margin: "8px 0 0 0",
    fontSize: `${subtitleSize}px`,
    lineHeight: 1.5,
    color: "#8a78a8",
    fontWeight: "600",
  };

  return (
    <div style={wrapperStyle}>
      <div style={iconWrapStyle}>
        <svg
          width={iconSize * 0.78}
          height={iconSize * 0.78}
          viewBox="0 0 64 64"
          fill="none"
        >
          <path
            d="M11.5 18.5C11.5 15.7386 13.7386 13.5 16.5 13.5H27.5C31.3027 13.5 34.7411 15.0691 37 17.5968V47C34.9936 45.5458 32.3761 44.7 29.5 44.7H16.5C13.7386 44.7 11.5 42.4614 11.5 39.7V18.5Z"
            fill="white"
          />
          <path
            d="M52.5 18.5C52.5 15.7386 50.2614 13.5 47.5 13.5H36.5C32.6973 13.5 29.2589 15.0691 27 17.5968V47C29.0064 45.5458 31.6239 44.7 34.5 44.7H47.5C50.2614 44.7 52.5 42.4614 52.5 39.7V18.5Z"
            fill="white"
            fillOpacity="0.96"
          />
          <path
            d="M32 16V47"
            stroke="#DDD6FE"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M40 13.5V29L44 26L48 29V13.5"
            fill="#DDD6FE"
          />
          <path
            d="M17.5 22H27"
            stroke="#DDD6FE"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path
            d="M17.5 28H28.5"
            stroke="#DDD6FE"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {showText && (
        <div>
          <h1 style={titleStyle}>ReadTrack</h1>
          <p style={subtitleStyle}>AI-Based Reading Habit Tracker</p>
        </div>
      )}
    </div>
  );
}

export default ReadTrackLogo;