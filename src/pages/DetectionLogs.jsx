import { useState, useMemo } from "react";
import "../styles/DetectionLogs.css";

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

function DetectionLogs({ recentDetections = [], detectionStats = {} }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  // Today's date string for filtering
  const today = new Date().toLocaleDateString();

  // Filter to today's detections only
  const todayLogs = useMemo(() =>
    recentDetections.filter((log) => {
      const logDate = new Date(log.timestamp || Date.now()).toLocaleDateString();
      return logDate === today;
    }),
    [recentDetections, today]
  );

  // Total for percentage calculation
  const total = detectionStats.total || 0;
  const totalToday = todayLogs.length || 0;

  // Count per type for today
  const todayStats = useMemo(() => {
    const counts = {};
    VEHICLE_TYPES.forEach((t) => (counts[t] = 0));
    todayLogs.forEach((log) => {
      const label = log.type?.toLowerCase();
      if (label in counts) counts[label]++;
    });
    return counts;
  }, [todayLogs]);

  // Filtered table rows
  const filtered = recentDetections.filter((log) => {
    const matchType = filter === "all" || log.type?.toLowerCase() === filter;
    const matchSearch = log.type?.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="detection-logs">
      <h1>Detection Logs</h1>

      {/* Today's date */}
      <p style={{ color: "#888", marginBottom: 16 }}>
        Today: {today} — {totalToday} detection(s) so far
      </p>

      {/* Vehicle Type Breakdown — today only */}
      <section className="percentage-section">
        <h2>Vehicle Type Breakdown <span style={{ fontSize: 14, color: "#999" }}>(today)</span></h2>
        <div className="percentage-grid">
          {VEHICLE_TYPES.map((type) => {
            const count = todayStats[type] || 0;
            const pct = totalToday === 0 ? 0 : ((count / totalToday) * 100).toFixed(1);
            const color = COLORS[type];
            return (
              <div key={type} className="percentage-card">
                <div className="pct-header">
                  <span className="pct-label" style={{ color }}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </span>
                  <span className="pct-value">{pct}%</span>
                </div>
                <div className="pct-bar-bg">
                  <div
                    className="pct-bar-fill"
                    style={{ width: `${pct}%`, background: color, transition: "width 0.4s" }}
                  />
                </div>
                <span className="pct-count">{count} detected today</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Filters */}
      <section className="logs-filters">
        <input
          type="text"
          placeholder="Search vehicle type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Types</option>
          {VEHICLE_TYPES.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </section>

      {/* Detections Table */}
      <section className="logs-table-section">
        <h2>All Detections ({filtered.length})</h2>
        {filtered.length === 0 ? (
          <p className="no-data">
            No detections yet — go to Live Camera to start detecting.
          </p>
        ) : (
          <table className="logs-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Vehicle Type</th>
                <th>Confidence</th>
                <th>Confidence Bar</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log, i) => {
                const color = COLORS[log.type?.toLowerCase()] || "#888";
                const pct = parseFloat(log.confidence);
                return (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>
                      <span
                        className="type-badge"
                        style={{ background: color, color: "#000" }}
                      >
                        {log.type}
                      </span>
                    </td>
                    <td>{log.confidence}</td>
                    <td>
                      <div className="pct-bar-bg">
                        <div
                          className="pct-bar-fill"
                          style={{ width: `${pct}%`, background: color }}
                        />
                      </div>
                    </td>
                    <td>{log.time}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export default DetectionLogs;