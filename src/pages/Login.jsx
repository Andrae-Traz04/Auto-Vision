import { useState } from "react";
import "../styles/Login.css";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      setUser({ name: email });
    }
  };

  return (
    <main className="login-page">
      <section className="login-wrapper">
        <h1>AutoVision</h1>
        <p className="subtitle">
          AI Vehicle Detection & Model Classification System
        </p>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Access System</button>
        </form>
      </section>
    </main>
  );
}

export default Login;