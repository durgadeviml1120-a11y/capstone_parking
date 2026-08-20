import { useState } from "react";
import { Link } from "react-router-dom";
import parkingImage from "./assets/parking-login.png";
import "./login.css";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");

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
    }
  };

  return (
    <div className="login-page">

      {/* ================= LEFT IMAGE ================= */}

      <div className="login-image-section">
        <img
          src={parkingImage}
          alt="Smart Parking"
          className="parking-image"
        />
      </div>

      {/* ================= RIGHT SIGNUP ================= */}

      <div className="login-form-section">

        <div className="login-card">

          <h1>Create Account</h1>

          <p className="login-subtitle">
            Create your Smart Parking account
          </p>

          <form onSubmit={handleSignup}>

            {/* Username */}

            <label>Username</label>

            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            {/* Email */}

            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* Password */}

            <label>Password</label>

            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
            />

            {/* Signup Button */}

            <button type="submit" className="login-button">
              Sign Up
            </button>

          </form>

          {/* Message */}

          {message && (
            <p
              style={{
                marginTop: "20px",
                textAlign: "center",
                color: message.includes("successful")
                  ? "green"
                  : "red",
              }}
            >
              {message}
            </p>
          )}

          {/* Login Link */}

          <p className="signup-text">
            Already have an account?{" "}
            <Link to="/login">Login</Link>
          </p>

        </div>

      </div>

    </div>
  );
}

export default Signup;