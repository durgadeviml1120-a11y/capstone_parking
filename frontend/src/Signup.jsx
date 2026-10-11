import { useState } from "react";
import { Link } from "react-router-dom";
import parkingImage from "./assets/signup-parking.png";
import "./signup.css";
import api from "./api";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ PASSWORD VALIDATION FUNCTION
  const validatePassword = (pwd) => {
    return {
      minLength: pwd.length >= 8,
      noSpaces: !pwd.includes(" "),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
      hasUpperCase: /[A-Z]/.test(pwd),
      hasLowerCase: /[a-z]/.test(pwd),
      hasNumber: /[0-9]/.test(pwd),
    };
  };

  // ✅ GET PASSWORD STRENGTH
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { level: "", color: "" };
    const requirements = validatePassword(pwd);
    const metRequirements = Object.values(requirements).filter(Boolean).length;

    if (metRequirements <= 2) return { level: "Weak", color: "#ef4444" };
    if (metRequirements <= 4) return { level: "Fair", color: "#f97316" };
    if (metRequirements <= 5) return { level: "Good", color: "#eab308" };
    return { level: "Strong", color: "#22c55e" };
  };

  // ✅ CHECK IF PASSWORD IS VALID
  const isPasswordValid = (pwd) => {
    const requirements = validatePassword(pwd);
    return Object.values(requirements).every(Boolean);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");

    // Check if passwords match
    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    // Check if password meets requirements
    if (!isPasswordValid(password)) {
      setMessage("Password does not meet all requirements!");
      return;
    }

    try {
      const response = await api.post("/signup/", {
        username,
        email,
        password,
      });

      if (response.status === 201 || response.status === 200) {
        setMessage("Signup successful! You can now login.");
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
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

  const passwordStrength = getPasswordStrength(password);

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

            {/* ✅ PASSWORD FIELD WITH STRENGTH METER */}
            <div className="signup-field">
              <label>Password</label>

              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {/* ✅ PASSWORD STRENGTH METER */}
              {password && (
                <div style={{ marginTop: "0.75rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: "0.875rem", fontWeight: "600" }}>Password Strength:</span>
                    <span 
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: "700",
                        color: "white",
                        backgroundColor: passwordStrength.color,
                        padding: "0.25rem 0.75rem",
                        borderRadius: "0.375rem"
                      }}
                    >
                      {passwordStrength.level}
                    </span>
                  </div>

                  {/* Strength Bar */}
                  <div style={{
                    width: "100%",
                    backgroundColor: "#e5e7eb",
                    borderRadius: "9999px",
                    height: "0.5rem",
                    overflow: "hidden"
                  }}>
                    <div
                      style={{
                        height: "100%",
                        backgroundColor: passwordStrength.color,
                        width: `${(Object.values(validatePassword(password)).filter(Boolean).length / 6) * 100}%`,
                        transition: "width 0.3s ease"
                      }}
                    ></div>
                  </div>

                  {/* ✅ REQUIREMENTS CHECKLIST */}
                  <div style={{
                    marginTop: "0.75rem",
                    backgroundColor: "#f9fafb",
                    padding: "0.75rem",
                    borderRadius: "0.375rem",
                    fontSize: "0.875rem",
                    border: "1px solid #e5e7eb"
                  }}>
                    <div style={{
                      color: validatePassword(password).minLength ? "#16a34a" : "#dc2626",
                      marginBottom: "0.375rem"
                    }}>
                      {validatePassword(password).minLength ? "✅" : "❌"} Minimum 8 characters
                    </div>
                    <div style={{
                      color: validatePassword(password).noSpaces ? "#16a34a" : "#dc2626",
                      marginBottom: "0.375rem"
                    }}>
                      {validatePassword(password).noSpaces ? "✅" : "❌"} No spaces
                    </div>
                    <div style={{
                      color: validatePassword(password).hasSpecialChar ? "#16a34a" : "#dc2626",
                      marginBottom: "0.375rem"
                    }}>
                      {validatePassword(password).hasSpecialChar ? "✅" : "❌"} Special character (!@#$%^&*)
                    </div>
                    <div style={{
                      color: validatePassword(password).hasUpperCase ? "#16a34a" : "#dc2626",
                      marginBottom: "0.375rem"
                    }}>
                      {validatePassword(password).hasUpperCase ? "✅" : "❌"} Uppercase letter (A-Z)
                    </div>
                    <div style={{
                      color: validatePassword(password).hasLowerCase ? "#16a34a" : "#dc2626",
                      marginBottom: "0.375rem"
                    }}>
                      {validatePassword(password).hasLowerCase ? "✅" : "❌"} Lowercase letter (a-z)
                    </div>
                    <div style={{
                      color: validatePassword(password).hasNumber ? "#16a34a" : "#dc2626"
                    }}>
                      {validatePassword(password).hasNumber ? "✅" : "❌"} Number (0-9)
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ✅ CONFIRM PASSWORD FIELD */}
            <div className="signup-field">
              <label>Confirm Password</label>

              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {confirmPassword && password !== confirmPassword && (
                <small style={{ color: "#dc2626" }}>
                  ❌ Passwords do not match
                </small>
              )}

              {confirmPassword && password === confirmPassword && (
                <small style={{ color: "#16a34a" }}>
                  ✅ Passwords match
                </small>
              )}
            </div>

            {/* ✅ SUBMIT BUTTON - DISABLED UNTIL ALL REQUIREMENTS MET */}
            <button
              type="submit"
              className="signup-button"
              disabled={
                !username ||
                !email ||
                !password ||
                !confirmPassword ||
                password !== confirmPassword ||
                !isPasswordValid(password)
              }
              style={{
                opacity: (
                  !username ||
                  !email ||
                  !password ||
                  !confirmPassword ||
                  password !== confirmPassword ||
                  !isPasswordValid(password)
                ) ? 0.5 : 1,
                cursor: (
                  !username ||
                  !email ||
                  !password ||
                  !confirmPassword ||
                  password !== confirmPassword ||
                  !isPasswordValid(password)
                ) ? "not-allowed" : "pointer"
              }}
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