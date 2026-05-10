import React, { useState, useEffect } from "react";
import LiveCamera from "./LiveCamera.jsx";
import "../styles/DeviceManagement.css";

const DRF_URL = "http://127.0.0.1:8000/api/devices";

function DeviceManagement() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableCameras, setAvailableCameras] = useState([]);
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [selectedCameraIndex, setSelectedCameraIndex] = useState(0);

  useEffect(() => {
    const getCameras = async () => {
      try {
        // Must request permission first so labels are visible
        await navigator.mediaDevices.getUserMedia({ video: true });
        const mediaDevices = await navigator.mediaDevices.enumerateDevices();
        const cams = mediaDevices.filter((d) => d.kind === "videoinput");
        setAvailableCameras(cams);
      } catch (err) {
        console.error("Camera permission denied:", err);
      }
    };
    getCameras();
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    setLoading(true);
    try {
      const res = await fetch(DRF_URL);
      if (res.ok) {
        const data = await res.json();
        setDevices(data);
      }
    } catch (err) {
      console.error("Cannot reach backend:", err);
    } finally {
      setLoading(false);
    }
  };

  const addDevice = async () => {
    if (!name.trim() || !location.trim()) {
      alert("Please enter name and location!");
      return;
    }

    const selectedCam = availableCameras[selectedCameraIndex];

    try {
      const res = await fetch(`${DRF_URL}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          location,
          device_id: selectedCam?.deviceId || "",
          status: "Online",
        }),
      });

      if (res.ok) {
        setName("");
        setLocation("");
        fetchDevices();
      } else {
        // fallback: add locally if backend fails
        const newDevice = {
          id: Date.now(),
          name,
          location,
          device_id: selectedCam?.deviceId || "",
          status: "Online",
        };
        setDevices((prev) => [...prev, newDevice]);
        setName("");
        setLocation("");
      }
    } catch (err) {
      // fallback: add locally
      const selectedCam = availableCameras[selectedCameraIndex];
      const newDevice = {
        id: Date.now(),
        name,
        location,
        device_id: selectedCam?.deviceId || "",
        status: "Online",
      };
      setDevices((prev) => [...prev, newDevice]);
      setName("");
      setLocation("");
    }
  };

  const deleteDevice = async (id) => {
    try {
      await fetch(`${DRF_URL}/${id}/`, { method: "DELETE" });
    } catch (err) {
      console.error("Delete error:", err);
    }
    // always remove from local state
    setDevices((prev) => prev.filter((d) => d.id !== id));
  };

  const toggleStatus = async (device) => {
    const newStatus = device.status === "Online" ? "Offline" : "Online";
    try {
      await fetch(`${DRF_URL}/${device.id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.error("Toggle error:", err);
    }
    // always update local state
    setDevices((prev) =>
      prev.map((d) => d.id === device.id ? { ...d, status: newStatus } : d)
    );
  };

  const filteredDevices = devices.filter(
    (d) =>
      d.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.location?.toLowerCase().includes(search.toLowerCase())
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
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <select
          value={selectedCameraIndex}
          onChange={(e) => setSelectedCameraIndex(Number(e.target.value))}
        >
          {availableCameras.map((cam, idx) => (
            <option key={idx} value={idx}>
              {cam.label || `Camera ${idx + 1}`}
            </option>
          ))}
        </select>
        <button onClick={addDevice}>Add Camera</button>
      </div>

      {loading ? (
        <p style={{ color: "#999", marginTop: 24 }}>Loading devices...</p>
      ) : filteredDevices.length === 0 ? (
        <p style={{ color: "#999", marginTop: 24 }}>
          No devices found. Add a camera above.
        </p>
      ) : (
        <div className="camera-grid">
          {filteredDevices.map((device) => (
            <div key={device.id} className="camera-card">
              <h3>{device.name}</h3>
              <p>Location: {device.location}</p>
              <p>
                Status:{" "}
                <span className="status-indicator">
                  <span className={`status-circle ${device.status === "Online" ? "online" : "offline"}`} />
                  {device.status}
                </span>
              </p>

              {/* ← use device_id directly from stored value */}
              {device.status === "Online" && (
                <div className="camera-feed">
                  <LiveCamera
                    deviceId={
                      // match stored device_id to available cameras
                      availableCameras.find(
                        (c) => c.deviceId === device.device_id
                      )?.deviceId ||
                      availableCameras[0]?.deviceId || // fallback to first camera
                      undefined
                    }
                  />
                </div>
              )}

              <div className="device-actions">
                <button onClick={() => toggleStatus(device)}>
                  Toggle Status
                </button>
                <button
                  className="delete-btn"
                  onClick={() => deleteDevice(device.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DeviceManagement;