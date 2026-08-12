import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import { useState } from "react";

// ==================== LOGIN ====================

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/auth/login/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);

        setMessage("Login successful!");

        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        setMessage(data.detail || "Invalid username or password");
      }
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to server");
    }
  };

  return (
    <div>
      <h1>Smart Parking</h1>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <br />
        <br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <br />
        <br />

        <button type="submit">Login</button>
      </form>

      {message && <p>{message}</p>}

      <p>
        Don't have an account?{" "}
        <Link to="/signup">Signup</Link>
      </p>
    </div>
  );
}

// ==================== SIGNUP ====================

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
    <div>
      <h1>Smart Parking</h1>
      <h2>Signup</h2>

      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <br />
        <br />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <br />
        <br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <br />
        <br />

        <button type="submit">Signup</button>
      </form>

      {message && <p>{message}</p>}

      <p>
        Already have an account?{" "}
        <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

// ==================== HOME ====================

function Home() {
  const token = localStorage.getItem("access_token");

  return (
    <div>
      <h1>Smart Parking</h1>

      {token ? (
        <>
          <h2>Welcome to Smart Parking</h2>
          <p>You are logged in.</p>

          <button
            onClick={() => {
              localStorage.removeItem("access_token");
              localStorage.removeItem("refresh_token");
              window.location.href = "/login";
            }}
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <h2>Smart Parking Management System</h2>

          <Link to="/login">
            <button>Login</button>
          </Link>

          {" "}

          <Link to="/signup">
            <button>Signup</button>
          </Link>
        </>
      )}
    </div>
  );
}

// ==================== APP ====================

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;