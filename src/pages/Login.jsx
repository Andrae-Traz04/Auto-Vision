import { useState } from "react";
import { authAPI } from "../service/api";
import { useAutoVision } from "../hooks/useAutoVision";
import "../styles/Login.css";

function Login({ setUser, switchToSignup }) {
  const { formData, handleInputChange } = useAutoVision();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.email && formData.password) {
      try {
        await authAPI.login(formData.email, formData.password);
        setUser({ name: formData.email });
      } catch (err) {
        if (err.response) {
          setError("Invalid credentials");
        } else {
          setError("Error connecting to server");
        }
      }
    }
  };

  return (
    <main className="login-page">
      <section className="login-wrapper">
        <h1>AutoVision</h1>
        <p className="subtitle">
          AI Vehicle Detection & Model Classification System
        </p>

        {error && <p className="error-message" style={{ color: "var(--accent-red)", marginBottom: "1rem" }}>{error}</p>}

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            name="email"
            placeholder="Admin Email"
            value={formData.email || ""}
            onChange={handleInputChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password || ""}
            onChange={handleInputChange}
            required
          />

          <button type="submit">Access System</button>
        </form>

        <p style={{ marginTop: "1rem", color: "var(--text-secondary)", textAlign: "center" }}>
          Don't have an account?{" "}
          <span
            style={{ color: "var(--primary-color)", cursor: "pointer", fontWeight: "bold" }}
            onClick={switchToSignup}
          >
            Sign Up
          </span>
        </p>
      </section>
    </main>
  );
}

export default Login;