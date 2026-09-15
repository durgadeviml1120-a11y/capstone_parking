import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import parkingImage from "./assets/parking-login.png";
import API from "./api";
import "./login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await API.post("login/", {
        username,
        password,
      });

      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      localStorage.setItem("username", username);

      const userResponse = await API.get("me/");
      const role = userResponse.data.role;

      localStorage.setItem("user_role", role);

      setMessage("Login successful!");

      setTimeout(() => {
        if (role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/dashboard");
        }
      }, 500);
    } catch (error) {
      console.error(error);

      const errorMessage =
        error.response?.data?.detail ||
        "Invalid username or password";

      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* LEFT VISUAL SECTION */}
      <div className="login-visual">

        <img
          src={parkingImage}
          alt="Smart Parking"
          className="login-background-image"
        />

        <div className="login-visual-overlay"></div>

        <div className="login-brand">

          <div className="brand-badge">
            <span>🅿</span>
          </div>

          <p className="brand-small">
            SMART MOBILITY
          </p>

          <h1>
            Find. Park.
            <br />
            <span>Go.</span>
          </h1>

          <p className="brand-description">
            A smarter way to find, reserve and manage
            your parking space.
          </p>

          <div className="brand-features">
            <div>
              <span>✓</span>
              Real-time availability
            </div>

            <div>
              <span>✓</span>
              Secure slot booking
            </div>

            <div>
              <span>✓</span>
              Easy digital payments
            </div>
          </div>

        </div>

      </div>

      {/* RIGHT LOGIN SECTION */}
      <div className="login-form-section">

        <div className="login-card">

          <div className="mobile-brand">
            <div className="brand-badge">
              <span>🅿</span>
            </div>
            <span>SMART PARKING</span>
          </div>

          <div className="login-heading">
            <p className="welcome-label">
              WELCOME BACK
            </p>

            <h2>
              Sign in to your account
            </h2>

            <p>
              Access your parking dashboard and
              manage your bookings.
            </p>
          </div>

          <form onSubmit={handleLogin}>

            <div className="input-group">
              <label htmlFor="username">
                Username
              </label>

              <div className="input-wrapper">
                <span className="input-icon">👤</span>

                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)
                  }
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password">
                Password
              </label>

              <div className="input-wrapper">
                <span className="input-icon">🔒</span>

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <span>→</span>
                </>
              )}
            </button>

          </form>

          {message && (
            <div
              className={`login-message ${
                message === "Login successful!"
                  ? "success"
                  : "error"
              }`}
            >
              {message}
            </div>
          )}

          <div className="login-divider">
            <span>New to Smart Parking?</span>
          </div>

          <Link
            to="/signup"
            className="signup-button"
          >
            Create an account
          </Link>

          <p className="login-footer">
            Smart Parking &nbsp;•&nbsp; Smart Mobility
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;