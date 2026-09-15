import { useState } from "react";
import { Link } from "react-router-dom";
import parkingImage from "./assets/parking-login.png";
import "./signup.css";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/auth/signup/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Signup successful! You can now login.");

        setUsername("");
        setEmail("");
        setPassword("");
      } else {
        setMessage(
          data.detail ||
            data.username?.[0] ||
            data.email?.[0] ||
            data.password?.[0] ||
            "Signup failed"
        );
      }
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">

      {/* ================= LEFT VISUAL ================= */}

      <div className="signup-visual">

        <img
          src={parkingImage}
          alt="Smart Parking"
          className="signup-background-image"
        />

        <div className="signup-visual-overlay"></div>

        <div className="signup-brand">

          <div className="signup-brand-badge">
            🅿
          </div>

          <p className="signup-brand-small">
            SMART MOBILITY
          </p>

          <h1>
            Park
            <br />
            <span>Smarter.</span>
          </h1>

          <p className="signup-brand-description">
            Create your account and experience a
            simpler way to find, reserve and manage
            your parking space.
          </p>

          <div className="signup-features">

            <div>
              <span>✓</span>
              Real-time parking availability
            </div>

            <div>
              <span>✓</span>
              Quick and secure booking
            </div>

            <div>
              <span>✓</span>
              Simple digital payments
            </div>

          </div>

        </div>

      </div>

      {/* ================= RIGHT SIGNUP ================= */}

      <div className="signup-form-section">

        <div className="signup-card">

          {/* Mobile logo */}

          <div className="signup-mobile-brand">

            <div className="signup-mobile-badge">
              🅿
            </div>

            <span>SMART PARKING</span>

          </div>

          {/* Heading */}

          <div className="signup-heading">

            <p className="signup-welcome">
              GET STARTED
            </p>

            <h2>
              Create your account
            </h2>

            <p>
              Join Smart Parking and make parking
              easier every day.
            </p>

          </div>

          {/* Form */}

          <form onSubmit={handleSignup}>

            {/* Username */}

            <div className="signup-input-group">

              <label htmlFor="username">
                Username
              </label>

              <div className="signup-input-wrapper">

                <span className="signup-input-icon">
                  👤
                </span>

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

            {/* Email */}

            <div className="signup-input-group">

              <label htmlFor="email">
                Email
              </label>

              <div className="signup-input-wrapper">

                <span className="signup-input-icon">
                  ✉
                </span>

                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />

              </div>

            </div>

            {/* Password */}

            <div className="signup-input-group">

              <label htmlFor="password">
                Password
              </label>

              <div className="signup-input-wrapper">

                <span className="signup-input-icon">
                  🔒
                </span>

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  minLength={8}
                  required
                />

                <button
                  type="button"
                  className="signup-password-toggle"
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

              <p className="password-hint">
                Password must contain at least 8 characters.
              </p>

            </div>

            {/* Button */}

            <button
              type="submit"
              className="signup-button-main"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="signup-spinner"></span>
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <span>→</span>
                </>
              )}

            </button>

          </form>

          {/* Message */}

          {message && (
            <div
              className={`signup-message ${
                message.includes("successful")
                  ? "signup-success"
                  : "signup-error"
              }`}
            >
              {message}
            </div>
          )}

          {/* Login */}

          <div className="signup-divider">
            <span>Already have an account?</span>
          </div>

          <Link
            to="/login"
            className="signup-login-button"
          >
            Sign in to your account
          </Link>

          <p className="signup-footer">
            Smart Parking &nbsp;•&nbsp; Smart Mobility
          </p>

        </div>

      </div>

    </div>
  );
}

export default Signup;