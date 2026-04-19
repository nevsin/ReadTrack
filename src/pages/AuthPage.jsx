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
      "radial-gradient(circle at top left, #f3ecff 0%, #faf7ff 30%, #f6f4fb 100%)",
    padding: "24px",
  };

  const cardStyle = {
    width: "100%",
    maxWidth: "500px",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.97) 0%, rgba(250,247,255,0.99) 100%)",
    borderRadius: "28px",
    padding: "32px",
    border: "1px solid #eee5fb",
    boxShadow: "0 20px 40px rgba(76, 29, 149, 0.08)",
  };

  const logoWrapStyle = {
    marginBottom: "24px",
  };

  const subtitleStyle = {
    margin: "0 0 24px 0",
    color: "#7c6a96",
    fontSize: "15px",
    lineHeight: "1.6",
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
    fontWeight: "600",
    color: "#6f5f88",
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "14px",
    border: "1px solid #ddd1f7",
    fontSize: "15px",
    backgroundColor: "#fcfbff",
    color: "#24153f",
    boxSizing: "border-box",
  };

  const buttonStyle = {
    padding: "14px 20px",
    borderRadius: "14px",
    border: "none",
    background: "linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)",
    color: "white",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 12px 24px rgba(139, 92, 246, 0.22)",
  };

  const textButtonStyle = {
    border: "none",
    background: "transparent",
    color: "#7c3aed",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    padding: 0,
    textAlign: "left",
  };

  const footerActionsStyle = {
    marginTop: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
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
        <div style={logoWrapStyle}>
          <ReadTrackLogo size={72} stacked />
        </div>

        <p style={subtitleStyle}>
          {isResetMode
            ? "Enter your email and we will send you a password reset link."
            : isLoginMode
            ? "Sign in to manage your library, reading sessions, and yearly goal."
            : "Create your account to start building your reading habit."}
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
            <p style={{ margin: 0, color: "#be185d", fontSize: "14px" }}>
              {authError}
            </p>
          )}

          {authMessage && (
            <p style={{ margin: 0, color: "#6d28d9", fontSize: "14px" }}>
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
      </div>
    </div>
  );
}

export default AuthPage;