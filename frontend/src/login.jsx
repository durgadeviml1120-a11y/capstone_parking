import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import parkingImage from "./assets/parking-login.png";
import API from "./api";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  setMessage("");

  try {
    const response = await API.post("login/", {
      username,
      password,
    });

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
  }
};
  return (
    <div className="login-page">

      <div className="login-image-section">
        <img
          src={parkingImage}
          alt="Smart Parking"
        />

        <div className="login-image-text">
          <h1>Smart Parking</h1>
          <p>
            Find, reserve and manage your parking
            space easily.
          </p>
        </div>
      </div>

      <div className="login-form-section">

        <div className="login-card">

          <h1>Welcome Back</h1>

          <p>
            Login to your Smart Parking account
          </p>

          <form onSubmit={handleLogin}>

            <label>Username</label>

            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              required
            />

            <label>Password</label>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

            <button type="submit">
              Login
            </button>

          </form>

          {message && (
            <p className="login-message">
              {message}
            </p>
          )}

          <p className="signup-link">
            Don't have an account?{" "}
            <Link to="/signup">
              Sign up
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;