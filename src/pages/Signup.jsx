import { useState } from "react";
import { authAPI } from "../service/api";
import { useAutoVision } from "../hooks/useAutoVision";
import "../styles/Login.css";
import "../styles/Signup.css";

function Signup({ setUser, switchToLogin }) {
  const { formData, handleInputChange } = useAutoVision();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.email && formData.password) {
      try {
        await authAPI.register(formData.email, formData.password);
        setUser({ name: formData.email });
      } catch (err) {
        if (err.response) {
          setError(err.response.data.error || "Signup failed");
        } else {
          setError("Error connecting to server");
        }
      }
    }
  };

  return (
    <main className="login-page">
      <section className="login-wrapper">
        <h1>AutoVision Signup</h1>
        <p className="subtitle">
          Create an account to access the system
        </p>

        {error && <p className="signup-error">{error}</p>}

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            name="email"
            placeholder="Email Address"
            value={formData.email || ""}
            onChange={handleInputChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Choose Password"
            value={formData.password || ""}
            onChange={handleInputChange}
            required
          />

          <button type="submit">Create Account</button>
        </form>

        <p className="signup-footer">
          Already have an account?{" "}
          <span className="signup-link" onClick={switchToLogin}>
            Log In
          </span>
        </p>
      </section>
    </main>
  );
}

export default Signup;
