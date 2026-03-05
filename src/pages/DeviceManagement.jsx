import React, { useState, useEffect } from "react";
import LiveCamera from "./LiveCamera.jsx";
import { useAutoVision } from "../hooks/useAutoVision";
import "../styles/DeviceManagement.css";

function DeviceManagement() {
  const [devices, setDevices] = useState([]);
  const { formData, handleInputChange, resetForm } = useAutoVision();
  const [availableCameras, setAvailableCameras] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const getCameras = async () => {
      const mediaDevices = await navigator.mediaDevices.enumerateDevices();
      const cams = mediaDevices.filter((d) => d.kind === "videoinput");
      setAvailableCameras(cams);
    };
    getCameras();
  }, []);

  const addDevice = () => {
    const name = formData.name || "";
    const location = formData.location || "";
    const deviceId = formData.deviceId || (availableCameras[0]?.deviceId || "");

    if (!name.trim() || !location.trim() || !deviceId) {
      alert("Please enter name, location, and select a camera!");
      return;
    }

    const device = {
      id: Date.now(),
      name,
      location,
      status: "Online",
      deviceId,
    };

    setDevices([...devices, device]);
    resetForm();
  };

  const deleteDevice = (id) => {
    setDevices(devices.filter((d) => d.id !== id));
  };

  const toggleStatus = (id) => {
    setDevices(
      devices.map((d) =>
        d.id === id
          ? { ...d, status: d.status === "Online" ? "Offline" : "Online" }
          : d
      )
    );
  };

  const filteredDevices = devices.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="device-management">
      <h1>Device Management</h1>

      <div className="device-search">
        <input
          type="text"
          placeholder="Search devices..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="device-form">
        <input
          type="text"
          name="name"
          placeholder="Camera Name"
          value={formData.name || ""}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location || ""}
          onChange={handleInputChange}
        />
        <select
          name="deviceId"
          value={formData.deviceId || availableCameras[0]?.deviceId || ""}
          onChange={handleInputChange}
        >
          {availableCameras.map((cam, idx) => (
            <option key={idx} value={cam.deviceId}>
              {cam.label || `Camera ${idx + 1}`}
            </option>
          ))}
        </select>
        <button onClick={addDevice}>Add Camera</button>
      </div>

      {/* ✅ Grid of camera feeds */}
      <div className="camera-grid">
        {filteredDevices.map((device) => (
          <div key={device.id} className="camera-card">
            <h3>{device.name}</h3>
            <p>Location: {device.location}</p>
            <p>
              Status:{" "}
              <span className="status-indicator">
                <span
                  className={`status-circle ${device.status === "Online" ? "online" : "offline"
                    }`}
                ></span>
                {device.status}
              </span>
            </p>

            {device.status === "Online" && device.deviceId && (
              <div className="camera-feed">
                <LiveCamera deviceId={device.deviceId} />
              </div>
            )}

            <div className="device-actions">
              <button onClick={() => toggleStatus(device.id)}>Toggle Status</button>
              <button className="delete-btn" onClick={() => deleteDevice(device.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DeviceManagement;
