import React, { useState } from "react";
import "./App.css";
import LiveCamera from "./pages/LiveCamera.jsx";
import DetectionLogs from "./pages/DetectionLogs.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import MultiCamera from "./pages/MultiCamera.jsx";
import CardGrid from "./components/CardGrid.jsx"; 
import DeviceManagement from "./pages/DeviceManagement.jsx";
import UserManagement from "./pages/UserManagement.jsx"; // ✅ new import

function App() {
  const [user, setUser] = useState(null);
  const [authView, setAuthView] = useState("login");
  const [view, setView] = useState("dashboard");
  const [filter, setFilter] = useState("All");

  const stats = [
    { id: 1, label: "Total Vehicles", value: 12 },
    { id: 2, label: "Cars", value: 6 },
    { id: 3, label: "Motorcycles", value: 4 },
    { id: 4, label: "Trucks", value: 2 },
  ];

  const recentDetections = [
    { id: 1, type: "Car", confidence: "92%" },
    { id: 2, type: "Motorcycle", confidence: "88%" },
    { id: 3, type: "Truck", confidence: "95%" },
    { id: 4, type: "Car", confidence: "90%" },
  ];

  const filteredDetections =
    filter === "All"
      ? recentDetections
      : recentDetections.filter((v) => v.type === filter);

  const handleLogout = () => {
    setUser(null);
    setView("dashboard");
    setAuthView("login");
  };

  if (!user) {
    return authView === "login" 
      ? <Login setUser={setUser} switchToSignup={() => setAuthView("signup")} />
      : <Signup setUser={setUser} switchToLogin={() => setAuthView("login")} />;
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>VehicleDetector</h2>
        <ul>
          <li onClick={() => setView("dashboard")}>Dashboard</li>
          <li onClick={() => setView("camera")}>Live Camera</li>
          <li onClick={() => setView("logs")}>Detection Logs</li>
          <li onClick={() => setView("devices")}>Device Management</li>
          <li onClick={() => setView("users")}>User Management</li> {/* ✅ new link */}
          <li onClick={handleLogout} className="logout-link">
            Logout
          </li>
        </ul>
      </aside>

      <main className="main-content">
        {view === "dashboard" && (
          <>
            <header className="dashboard-header">
              <h1>Vehicle Detection Dashboard</h1>
              <p>Welcome, {user.name}</p>
            </header>

            
            <section className="stats-grid">
              {stats.map((stat) => (
                <div key={stat.id} className="stat-card">
                  <h2>{stat.value}</h2>
                  <p>{stat.label}</p>
                </div>
              ))}
            </section>

            
            <div className="filter-section">
              <label>Filter by Type:</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option>All</option>
                <option>Car</option>
                <option>Motorcycle</option>
                <option>Truck</option>
              </select>
            </div>

            
            <MultiCamera />

            
            <CardGrid
              title="Recent Detections"
              data={filteredDetections}
              renderItem={(item) => (
                <>
                  <h3>{item.type}</h3>
                  <p>Confidence: {item.confidence}</p>
                </>
              )}
            />
          </>
        )}

        {view === "camera" && <LiveCamera />}
        {view === "logs" && <DetectionLogs />}
        {view === "devices" && <DeviceManagement />}
        {view === "users" && <UserManagement />} 
      </main>
    </div>
  );
}

export default App;
