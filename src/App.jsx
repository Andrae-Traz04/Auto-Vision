import React, { useState } from "react";
import "./App.css";
import LiveCamera from "./pages/LiveCamera.jsx";
import DetectionLogs from "./pages/DetectionLogs.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import MultiCamera from "./pages/MultiCamera.jsx";
import CardGrid from "./components/CardGrid.jsx";
import DeviceManagement from "./pages/DeviceManagement.jsx";
import UserManagement from "./pages/UserManagement.jsx";

const VEHICLE_TYPES = ["bicycle", "bus", "car", "jeepney", "motorcycle", "tricycle", "truck", "van"];

const COLORS = {
  bicycle:    "#00FFFF",
  bus:        "#0066FF",
  car:        "#00FF00",
  jeepney:    "#FF00FF",
  motorcycle: "#FFFF00",
  tricycle:   "#FF6600",
  truck:      "#FF0000",
  van:        "#FF69B4",
};

const defaultStats = {
  total: 0,
  bicycle: 0, bus: 0, car: 0, jeepney: 0,
  motorcycle: 0, tricycle: 0, truck: 0, van: 0,
};

function App() {
  const [user, setUser] = useState(null);
  const [authView, setAuthView] = useState("login");
  const [view, setView] = useState("dashboard");
  const [filter, setFilter] = useState("All");

  const [detectionStats, setDetectionStats] = useState(defaultStats);
  const [recentDetections, setRecentDetections] = useState([]);

  const updateDetections = (detections) => {
    if (!detections || detections.length === 0) return;

    setDetectionStats((prev) => {
      const updated = { ...prev };
      detections.forEach((det) => {
        const label = det.class?.toLowerCase();
        if (VEHICLE_TYPES.includes(label)) {
          updated[label] = (updated[label] || 0) + 1;
          updated.total += 1;
        }
      });
      return updated;
    });

    setRecentDetections((prev) => {
      const newEntries = detections.map((det) => ({
        type: det.class,
        confidence: (det.confidence * 100).toFixed(0) + "%",
        confidenceRaw: det.confidence,
        time: new Date().toLocaleTimeString(),
      }));
      return [...newEntries, ...prev].slice(0, 50);
    });
  };

  const handleLogout = () => {
    setUser(null);
    setView("dashboard");
    setAuthView("login");
    setDetectionStats(defaultStats);
    setRecentDetections([]);
  };

  if (!user) {
    return authView === "login"
      ? <Login setUser={setUser} switchToSignup={() => setAuthView("signup")} />
      : <Signup setUser={setUser} switchToLogin={() => setAuthView("login")} />;
  }

  const filteredDetections =
    filter === "All"
      ? recentDetections
      : recentDetections.filter((v) => v.type?.toLowerCase() === filter.toLowerCase());

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2>VehicleDetector</h2>
        <ul>
          <li onClick={() => setView("dashboard")}>Dashboard</li>
          <li onClick={() => setView("camera")}>Live Camera</li>
          <li onClick={() => setView("logs")}>Detection Logs</li>
          <li onClick={() => setView("devices")}>Device Management</li>
          <li onClick={() => setView("users")}>User Management</li>
          <li onClick={handleLogout} className="logout-link">Logout</li>
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
              <div className="stat-card stat-total">
                <h2>{detectionStats.total}</h2>
                <p>Total Vehicles</p>
              </div>
              {VEHICLE_TYPES.map((type) => (
                <div
                  key={type}
                  className="stat-card"
                  style={{ borderTop: `4px solid ${COLORS[type]}` }}
                >
                  <h2>{detectionStats[type] || 0}</h2>
                  <p style={{ textTransform: "capitalize" }}>{type}</p>
                </div>
              ))}
            </section>

            <div className="filter-section">
              <label>Filter by Type:</label>
              <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option>All</option>
                {VEHICLE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* ← only change: added updateDetections prop */}
            <MultiCamera updateDetections={updateDetections} />

            {/* Recent Detections */}
                <section className="recent-section">
                  <h2>Recent Detections</h2>
                  {recentDetections.length === 0 ? (
                    <p className="no-data">No detections yet — start the Live Camera.</p>
                  ) : (
                    <div className="stats-grid">  {/* ← reuse same grid as stat cards */}
                      {filteredDetections.slice(0, 8).map((det, i) => {
                        const color = COLORS[det.type?.toLowerCase()] || "#888";
                        const pct = parseFloat(det.confidence);
                        return (
                          <div
                            key={i}
                            className="stat-card"
                            style={{ borderTop: `4px solid ${color}` }}
                          >
                            {/* Vehicle type */}
                            <h2 style={{ color, margin: "0 0 4px", textTransform: "capitalize" }}>
                              {det.type}
                            </h2>

                            {/* Confidence % */}
                            <p style={{ margin: "0 0 8px", fontSize: 13, color: "#444" }}>
                              {det.confidence}
                            </p>

                            {/* Confidence bar */}
                            <div style={{ background: "#eee", borderRadius: 4, height: 6 }}>
                              <div style={{
                                width: `${pct}%`,
                                height: 6,
                                borderRadius: 4,
                                background: color,
                                transition: "width 0.3s",
                              }} />
                            </div>

                            {/* Time */}
                            <p style={{ margin: "6px 0 0", fontSize: 11, color: "#999" }}>
                              {det.time}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>
          </>
        )}

        {view === "camera" && (
          <LiveCamera updateDetections={updateDetections} />
        )}

        {view === "logs" && (
          <DetectionLogs
            recentDetections={recentDetections}
            detectionStats={detectionStats}
          />
        )}

        {view === "devices" && <DeviceManagement />}
        {view === "users" && <UserManagement />}
      </main>
    </div>
  );
}

export default App;