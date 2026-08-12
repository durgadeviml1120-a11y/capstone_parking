import { useState } from "react";
import API from "./api";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await API.post("signup/", {
        username,
        email,
        password,
      });

      setMessage("Signup successful! You can now login.");

      setUsername("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error(error);

      const data = error.response?.data;

      setMessage(
        data?.detail ||
        data?.username?.[0] ||
        data?.email?.[0] ||
        data?.password?.[0] ||
        "Signup failed"
      );
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
    </div>
  );
}

export default Signup;