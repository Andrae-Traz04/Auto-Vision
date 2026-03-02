import ".Dashboard.css";
import "../styles/Dashboard.css";

function Dashboard({ user, setUser }) {
  const handleLogout = () => {
    setUser(null);
  };

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div>
          <h2 className="system-title">AutoVision System</h2>
          <p className="welcome-text">Welcome, {user.name}</p>
        </div>

        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </header>

      <section className="dashboard-content">
        <h3 className="section-title">AI Vehicle Detection Dashboard</h3>
        <p className="section-description">
          Live camera monitoring and vehicle model classification data will appear here.
        </p>
      </section>
    </main>
  );
}

export default Dashboard;