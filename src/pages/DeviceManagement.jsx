import React, { useState, useEffect } from "react";
import LiveCamera from "./LiveCamera.jsx";
import "../styles/DeviceManagement.css";

function DeviceManagement() {
  const [devices, setDevices] = useState([]);
  const [newDevice, setNewDevice] = useState({ name: "", location: "", deviceId: "" });
  const [availableCameras, setAvailableCameras] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const getCameras = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cams = devices.filter((d) => d.kind === "videoinput");
      setAvailableCameras(cams);
      if (cams.length > 0) {
        setNewDevice((prev) => ({ ...prev, deviceId: cams[0].deviceId }));
      }
    };
    getCameras();
  }, []);

  const addDevice = () => {
    if (!newDevice.name.trim() || !newDevice.location.trim() || !newDevice.deviceId) {
      alert("Please enter name, location, and select a camera!");
      return;
    }

    const device = {
      id: Date.now(),
      name: newDevice.name,
      location: newDevice.location,
      status: "Online",
      deviceId: newDevice.deviceId,
    };

    setDevices([...devices, device]);
    setNewDevice({ name: "", location: "", deviceId: availableCameras[0]?.deviceId || "" });
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
          placeholder="Camera Name"
          value={newDevice.name}
          onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Location"
          value={newDevice.location}
          onChange={(e) => setNewDevice({ ...newDevice, location: e.target.value })}
        />
        <select
          value={newDevice.deviceId}
          onChange={(e) => setNewDevice({ ...newDevice, deviceId: e.target.value })}
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
                  className={`status-circle ${
                    device.status === "Online" ? "online" : "offline"
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
