import { useState } from "react";
import { Link } from "react-router-dom";
import parkingImage from "./assets/signup-parking.png";
import "./signup.css";
import api from "../api";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const handleSignup = async (e) => {
  e.preventDefault();
  setMessage("");

  try {
    const response = await api.post("/signup/", {  // ✅ Use api instance
      username,
      email,
      password,
    });

    if (response.status === 201 || response.status === 200) {
      setMessage("Signup successful! You can now login.");
      setUsername("");
      setEmail("");
      setPassword("");
    }
  } catch (error) {
    console.error(error);
    setMessage(
      error.response?.data?.detail ||
      error.response?.data?.username?.[0] ||
      error.response?.data?.email?.[0] ||
      error.response?.data?.password?.[0] ||
      "Signup failed"
    );
  }
};

  return (
    <div className="signup-page">

      {/* LEFT IMAGE */}
      <div className="signup-image-section">
        <img
          src={parkingImage}
          alt="Smart Parking"
          className="signup-parking-image"
        />

        <div className="signup-image-overlay">
          <div className="parking-logo">P</div>

          <h2>Park Smarter.</h2>

          <p>
            Simple, secure and convenient parking
            whenever you need it.
          </p>
        </div>
      </div>

      {/* RIGHT FORM */}
      <div className="signup-form-section">

        <div className="signup-card">

          <div className="signup-top-label">
            GET STARTED
          </div>

          <h1>Create your account</h1>

          <p className="signup-subtitle">
            Join Smart Parking and make parking easier.
          </p>

          <form onSubmit={handleSignup}>

            <div className="signup-field">
              <label>Username</label>

              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="signup-field">
              <label>Email</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="signup-field">
              <label>Password</label>

              <div className="password-wrapper">

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>

              <small>
                Use at least 8 characters.
              </small>
            </div>

            <button
              type="submit"
              className="signup-button"
            >
              Create Account
            </button>

          </form>

          {message && (
            <p
              className={
                message.includes("successful")
                  ? "signup-message success"
                  : "signup-message error"
              }
            >
              {message}
            </p>
          )}

          <p className="signin-text">
            Already have an account?{" "}
            <Link to="/login">Sign in</Link>
          </p>

          <div className="signup-footer">
            Smart Parking &nbsp;•&nbsp; Secure &nbsp;•&nbsp; Reliable
          </div>

        </div>

      </div>

    </div>
  );
}

export default Signup;