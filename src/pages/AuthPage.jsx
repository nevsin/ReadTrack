import { useState } from "react";
import {
  loginUser,
  registerUser,
  sendResetPasswordEmail,
} from "../authService";
import ReadTrackLogo from "../components/ReadTrackLogo";

function AuthPage({ onAuthSuccess }) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isResetMode, setIsResetMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authMessage, setAuthMessage] = useState("");

  const pageStyle = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "radial-gradient(circle at top left, #f3ecff 0%, #faf7ff 32%, #f6f4fb 100%)",
    padding: "32px",
  };

  const cardStyle = {
    width: "100%",
    maxWidth: "980px",
    display: "grid",
    gridTemplateColumns: "1fr 0.92fr",
    gap: "28px",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(250,247,255,0.99) 100%)",
    borderRadius: "34px",
    padding: "34px",
    border: "1px solid #eee5fb",
    boxShadow: "0 28px 70px rgba(76, 29, 149, 0.12)",
  };

  const formPanelStyle = {
    padding: "10px 6px",
  };

  const logoWrapStyle = {
    marginBottom: "22px",
  };

  const eyebrowStyle = {
    margin: "0 0 10px 0",
    color: "#8b5cf6",
    fontSize: "13px",
    fontWeight: "800",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  };

  const subtitleStyle = {
    margin: "0 0 26px 0",
    color: "#7c6a96",
    fontSize: "15px",
    lineHeight: "1.7",
    maxWidth: "430px",
  };

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "700",
    color: "#5f5078",
  };

  const inputStyle = {
    width: "100%",
    padding: "15px 16px",
    borderRadius: "16px",
    border: "1px solid #ddd1f7",
    fontSize: "15px",
    backgroundColor: "#fcfbff",
    color: "#24153f",
    boxSizing: "border-box",
    boxShadow: "0 8px 18px rgba(76, 29, 149, 0.04)",
  };

  const buttonStyle = {
    marginTop: "4px",
    padding: "15px 20px",
    borderRadius: "16px",
    border: "none",
    background: "linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)",
    color: "white",
    fontSize: "15px",
    fontWeight: "800",
    cursor: authLoading ? "not-allowed" : "pointer",
    boxShadow: "0 16px 28px rgba(139, 92, 246, 0.26)",
    opacity: authLoading ? 0.8 : 1,
  };

  const textButtonStyle = {
    border: "none",
    background: "transparent",
    color: "#7c3aed",
    fontSize: "14px",
    fontWeight: "800",
    cursor: "pointer",
    padding: 0,
    textAlign: "left",
  };

  const footerActionsStyle = {
    marginTop: "18px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  };

  const previewPanelStyle = {
    position: "relative",
    overflow: "hidden",
    borderRadius: "28px",
    padding: "26px",
    background:
      "linear-gradient(145deg, #4c1d95 0%, #6d28d9 48%, #8b5cf6 100%)",
    color: "white",
    minHeight: "430px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.28)",
  };

  const glowStyle = {
    position: "absolute",
    width: "240px",
    height: "240px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.18)",
    top: "-80px",
    right: "-80px",
  };

  const previewTitleStyle = {
    position: "relative",
    margin: "0 0 10px 0",
    fontSize: "25px",
    lineHeight: "1.2",
    letterSpacing: "-0.03em",
  };

  const previewTextStyle = {
    position: "relative",
    margin: 0,
    color: "rgba(255,255,255,0.82)",
    fontSize: "14px",
    lineHeight: "1.7",
  };

  const miniCardStyle = {
    position: "relative",
    background: "rgba(255,255,255,0.16)",
    border: "1px solid rgba(255,255,255,0.22)",
    borderRadius: "22px",
    padding: "18px",
    backdropFilter: "blur(10px)",
  };

  const miniCardHeaderStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "14px",
    color: "rgba(255,255,255,0.84)",
    fontSize: "13px",
    fontWeight: "700",
  };

  const progressTrackStyle = {
    width: "100%",
    height: "10px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.22)",
    overflow: "hidden",
    marginBottom: "16px",
  };

  const progressFillStyle = {
    width: "68%",
    height: "100%",
    borderRadius: "999px",
    background: "#ffffff",
  };

  const statGridStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    marginTop: "14px",
  };

  const statBoxStyle = {
    background: "rgba(255,255,255,0.14)",
    border: "1px solid rgba(255,255,255,0.18)",
    borderRadius: "18px",
    padding: "14px",
  };

  const statValueStyle = {
    display: "block",
    fontSize: "22px",
    fontWeight: "900",
    marginBottom: "4px",
  };

  const statLabelStyle = {
    color: "rgba(255,255,255,0.78)",
    fontSize: "12px",
    fontWeight: "700",
  };

  const featureListStyle = {
    position: "relative",
    display: "grid",
    gap: "10px",
    marginTop: "18px",
  };

  const featureItemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "rgba(255,255,255,0.86)",
    fontSize: "13px",
    fontWeight: "700",
  };

  const checkStyle = {
    width: "22px",
    height: "22px",
    borderRadius: "999px",
    display: "grid",
    placeItems: "center",
    background: "rgba(255,255,255,0.2)",
    flex: "0 0 auto",
  };

  function resetFeedback() {
    setAuthError("");
    setAuthMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    resetFeedback();

    if (!email.trim()) {
      setAuthError("Please enter your email.");
      return;
    }

    if (!isResetMode) {
      if (!password.trim()) {
        setAuthError("Please fill in both email and password.");
        return;
      }

      if (password.trim().length < 6) {
        setAuthError("Password must be at least 6 characters.");
        return;
      }
    }

    try {
      setAuthLoading(true);

      if (isResetMode) {
        await sendResetPasswordEmail(email);
        setAuthMessage("Password reset email sent. Please check your inbox.");
        return;
      }

      if (isLoginMode) {
        const user = await loginUser(email, password);

        if (onAuthSuccess) {
          onAuthSuccess(user);
        }
      } else {
        await registerUser(email, password);
        setAuthMessage(
          "Account created. Please verify your email before signing in."
        );
        setIsLoginMode(true);
        setIsResetMode(false);
        setPassword("");
        return;
      }
    } catch (error) {
      console.error("Authentication failed:", error);

      if (error.code === "auth/email-already-in-use") {
        setAuthError("This email is already registered.");
      } else if (error.code === "auth/invalid-credential") {
        setAuthError("Invalid email or password.");
      } else if (error.code === "auth/invalid-email") {
        setAuthError("Please enter a valid email address.");
      } else if (error.code === "auth/user-not-found") {
        setAuthError("No account found with this email.");
      } else if (error.code === "auth/missing-email") {
        setAuthError("Please enter your email.");
      } else if (error.code === "auth/too-many-requests") {
        setAuthError("Too many attempts. Please try again later.");
      } else if (error.code === "auth/weak-password") {
        setAuthError("Password must be at least 6 characters.");
      } else if (error.code === "auth/email-not-verified") {
        setAuthError("Please verify your email before signing in.");
      } else {
        setAuthError("Authentication failed. Please try again.");
      }
    } finally {
      setAuthLoading(false);
    }
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <section style={formPanelStyle}>
          <div style={logoWrapStyle}>
            <ReadTrackLogo size={72} stacked />
          </div>

          <p style={eyebrowStyle}>
            {isResetMode
              ? "Account Recovery"
              : isLoginMode
              ? "Welcome Back"
              : "Start Reading Smarter"}
          </p>

          <p style={subtitleStyle}>
            {isResetMode
              ? "Enter your email and we will send you a password reset link."
              : isLoginMode
              ? "Sign in to manage your library, reading sessions, yearly goal, and personalized book recommendations."
              : "Create your account to track your books, save reading sessions, and build a consistent reading routine."}
          </p>

          <form onSubmit={handleSubmit} style={formStyle}>
            <div>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
                style={inputStyle}
              />
            </div>

            {!isResetMode && (
              <div>
                <label style={labelStyle}>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  style={inputStyle}
                />
              </div>
            )}

            {authError && (
              <p
                style={{
                  margin: 0,
                  color: "#be185d",
                  fontSize: "14px",
                  fontWeight: "700",
                }}
              >
                {authError}
              </p>
            )}

            {authMessage && (
              <p
                style={{
                  margin: 0,
                  color: "#6d28d9",
                  fontSize: "14px",
                  fontWeight: "700",
                }}
              >
                {authMessage}
              </p>
            )}

            <button type="submit" style={buttonStyle} disabled={authLoading}>
              {authLoading
                ? isResetMode
                  ? "Sending Reset Link..."
                  : isLoginMode
                  ? "Signing In..."
                  : "Creating Account..."
                : isResetMode
                ? "Send Reset Link"
                : isLoginMode
                ? "Sign In"
                : "Create Account"}
            </button>
          </form>

          <div style={footerActionsStyle}>
            {isLoginMode && !isResetMode && (
              <button
                type="button"
                style={textButtonStyle}
                onClick={() => {
                  setIsResetMode(true);
                  resetFeedback();
                  setPassword("");
                }}
              >
                Forgot your password?
              </button>
            )}

            {isResetMode && (
              <button
                type="button"
                style={textButtonStyle}
                onClick={() => {
                  setIsResetMode(false);
                  setIsLoginMode(true);
                  resetFeedback();
                }}
              >
                Back to sign in
              </button>
            )}

            {!isResetMode && (
              <button
                type="button"
                style={textButtonStyle}
                onClick={() => {
                  setIsLoginMode((prev) => !prev);
                  resetFeedback();
                }}
              >
                {isLoginMode
                  ? "Don't have an account? Create one"
                  : "Already have an account? Sign in"}
              </button>
            )}
          </div>
        </section>

        <aside style={previewPanelStyle}>
          <div style={glowStyle}></div>

          <div>
            <h2 style={previewTitleStyle}>Build a reading habit that lasts.</h2>
            <p style={previewTextStyle}>
              ReadTrack helps you organize your library, record reading
              sessions, follow yearly goals, and discover books based on your
              reading profile.
            </p>

            <div style={featureListStyle}>
              <div style={featureItemStyle}>
                <span style={checkStyle}>✓</span>
                Track books and reading status
              </div>
              <div style={featureItemStyle}>
                <span style={checkStyle}>✓</span>
                Monitor yearly reading progress
              </div>
              <div style={featureItemStyle}>
                <span style={checkStyle}>✓</span>
                Get personalized book suggestions
              </div>
            </div>
          </div>

          <div style={miniCardStyle}>
            <div style={miniCardHeaderStyle}>
              <span>Yearly Goal Preview</span>
              <span>68%</span>
            </div>

            <div style={progressTrackStyle}>
              <div style={progressFillStyle}></div>
            </div>

            <div style={statGridStyle}>
              <div style={statBoxStyle}>
                <span style={statValueStyle}>12</span>
                <span style={statLabelStyle}>Books Read</span>
              </div>

              <div style={statBoxStyle}>
                <span style={statValueStyle}>34</span>
                <span style={statLabelStyle}>Sessions</span>
              </div>

              <div style={statBoxStyle}>
                <span style={statValueStyle}>4</span>
                <span style={statLabelStyle}>Reading Now</span>
              </div>

              <div style={statBoxStyle}>
                <span style={statValueStyle}>20</span>
                <span style={statLabelStyle}>Goal Target</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default AuthPage;