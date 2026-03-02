import React from "react";
import "../styles/DetectionLogs.css";

function DetectionLogs() {

  const logs = [
    {
      id: 1,
      type: "Car",
      confidence: "92%",
      date: "Feb 20, 2026",
      time: "6:15 PM",
    },
    {
      id: 2,
      type: "Motorcycle",
      confidence: "88%",
      date: "Feb 20, 2026",
      time: "6:17 PM",
    },
    {
      id: 3,
      type: "Truck",
      confidence: "95%",
      date: "Feb 20, 2026",
      time: "6:19 PM",
    },
  ];

  return (
    <div>
      <h1>Detection Logs</h1>

      <div className="logs-container">
        {logs.map((log) => (
          <div key={log.id} className="log-card">
            <h3>{log.type}</h3>
            <p>Confidence: {log.confidence}</p>
            <p>Date: {log.date}</p>
            <p>Time: {log.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DetectionLogs;