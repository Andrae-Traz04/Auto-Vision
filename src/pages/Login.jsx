import { useAutoVision } from "../hooks/useAutoVision";
import "../styles/Login.css";

function Login({ setUser }) {
  const { formData, handleInputChange } = useAutoVision();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.email && formData.password) {
      setUser({ name: formData.email });
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
      </section>
    </main>
  );
}

export default Login;