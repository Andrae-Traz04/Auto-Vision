import { useState } from "react";
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
        const res = await fetch("http://127.0.0.1:8000/api/auth/register/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email, password: formData.password })
        });
        if (res.ok) {
          setUser({ name: formData.email });
        } else {
          const data = await res.json();
          setError(data.error || "Signup failed");
        }
      } catch{
        setError("Error connecting to server");
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
 