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
      // Login API
      const response = await API.post("login/", {
        username,
        password,
      });

      // Save JWT tokens
      localStorage.setItem(
        "access_token",
        response.data.access
      );

      localStorage.setItem(
        "refresh_token",
        response.data.refresh
      );

      localStorage.setItem(
        "username",
        username
      );

      // Get logged-in user's details
      const userResponse = await API.get("me/");

      const role = userResponse.data.role;

      // Save role
      localStorage.setItem(
        "user_role",
        role
      );

      // Success message
      setMessage("Login successful!");

      // Navigate based on role
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

      {/* =================================
          COMPLETE PARKING LOGIN IMAGE
      ================================= */}

      <img
        src={parkingImage}
        alt="Smart Parking Login"
        className="login-background"
      />


      {/* =================================
          FUNCTIONAL LOGIN FORM
      ================================= */}

      <form
        className="login-functional-form"
        onSubmit={handleLogin}
      >

        {/* =================================
            USERNAME
        ================================= */}

        <div className="username-area">

          <input
            type="text"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            placeholder="Username"
            required
            aria-label="Username"
            autoComplete="username"
          />

        </div>


        {/* =================================
            PASSWORD
        ================================= */}

        <div className="password-area">

          <input
            type={
              showPassword
                ? "text"
                : "password"
            }
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            placeholder="Password"
            required
            aria-label="Password"
            autoComplete="current-password"
          />

        </div>


        {/* =================================
            PASSWORD EYE

            The eye image already exists
            inside parking-login.png.

            This button is invisible and
            only provides functionality.
        ================================= */}

        <button
          type="button"
          className="password-eye-area"
          onClick={() =>
            setShowPassword(!showPassword)
          }
          aria-label={
            showPassword
              ? "Hide password"
              : "Show password"
          }
        />


        {/* =================================
            REMEMBER ME
        ================================= */}

        <label className="remember-area">

          <input
            type="checkbox"
            defaultChecked
          />

        </label>


        {/* =================================
            FORGOT PASSWORD
        ================================= */}

        <button
          type="button"
          className="forgot-area"
          onClick={() =>
            alert(
              "Password reset feature coming soon."
            )
          }
          aria-label="Forgot Password"
        />


        {/* =================================
            LOGIN BUTTON
        ================================= */}

        <button
          type="submit"
          className="login-button-area"
          disabled={loading}
          aria-label="Login"
        >

          {loading && (
            <span className="login-loading-text">
              Signing in...
            </span>
          )}

        </button>


        {/* =================================
            SIGN UP
        ================================= */}

        <Link
          to="/signup"
          className="signup-area"
          aria-label="Sign up"
        />

      </form>


      {/* =================================
          LOGIN MESSAGE
      ================================= */}

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

    </div>
  );
}

export default Login;