import Bookings from "./Bookings";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import Login from "./login";
import Signup from "./Signup";

function Home() {
  const [token, setToken] = useState(
    localStorage.getItem("access_token")
  );

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setToken(null);
  };

  return (
    <div>
      <h1>Smart Parking</h1>

      {token ? (
        <>
          <h2>Welcome to Smart Parking</h2>
          <p>You are logged in.</p>

          <button onClick={handleLogout}>Logout</button>
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/bookings" element={<Bookings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;