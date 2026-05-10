import React, { useRef, useEffect, useState, useCallback } from "react";
import { useAutoVision } from "../hooks/useAutoVision";
import "../styles/LiveCamera.css";

const API_URL = "http://127.0.0.1:8000/api/detection/detect"; // ← change to your IP

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

function LiveCamera({ deviceId }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const isDetecting = useRef(false);
  const intervalRef = useRef(null);
  const { startCamera } = useAutoVision();
  const [status, setStatus] = useState("Starting camera...");

  const drawBoxes = useCallback((detections) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    detections.forEach((det) => {
      const [x1, y1, x2, y2] = det.bbox;
      const color = COLORS[det.class?.toLowerCase()] || "#FFFFFF";
      const label = `${det.class} ${(det.confidence * 100).toFixed(0)}%`;

      // Draw bounding box
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);

      // Draw label background
      ctx.font = "bold 13px Arial";
      const textWidth = ctx.measureText(label).width;
      ctx.fillStyle = color;
      ctx.fillRect(x1, y1 - 20, textWidth + 8, 20);

      // Draw label text
      ctx.fillStyle = "#000000";
      ctx.fillText(label, x1 + 4, y1 - 5);
    });
  }, []);

  const detectFrame = useCallback(async () => {
    if (isDetecting.current) return;
    if (!videoRef.current || videoRef.current.readyState !== 4) return;

    isDetecting.current = true;

    try {
      // Capture frame from video to canvas
      const video = videoRef.current;
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = video.videoWidth || 640;
      tempCanvas.height = video.videoHeight || 480;
      tempCanvas.getContext("2d").drawImage(video, 0, 0);

      // Convert to blob and send to your YOLOv8 API
      tempCanvas.toBlob(async (blob) => {
        try {
          const formData = new FormData();
          formData.append("file", blob, "frame.jpg");

          const response = await fetch(API_URL, {
            method: "POST",
            body: formData,
          });

          if (response.ok) {
            const result = await response.json();
            drawBoxes(result.detections || []);
            setStatus(`Detecting... ${result.detections?.length || 0} vehicle(s) found`);
          }
        } catch (err) {
          console.error("Detection error:", err);
          setStatus("API connection failed");
        } finally {
          isDetecting.current = false;
        }
      }, "image/jpeg", 0.6);

    } catch (err) {
      console.error("Frame capture error:", err);
      isDetecting.current = false;
    }
  }, [drawBoxes]);

  useEffect(() => {
    const initCamera = async () => {
      const stream = await startCamera(deviceId);
      if (stream && videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setStatus("Camera ready — detecting...");
      }
    };

    initCamera();

    // Run detection every 300ms
    intervalRef.current = setInterval(detectFrame, 300);

    return () => {
      clearInterval(intervalRef.current);
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      }
    };
  }, [deviceId, startCamera, detectFrame]);

  return (
    <div className="live-camera-wrapper">
      <div style={{ position: "relative", width: "640px", height: "480px" }}>
        <video
          ref={videoRef}
          width="640"
          height="480"
          style={{ position: "absolute" }}
          muted
          playsInline
        />
        <canvas
          ref={canvasRef}
          width="640"
          height="480"
          style={{ position: "absolute" }}
        />
      </div>

      {/* Status bar */}
      <div style={{
        marginTop: 8,
        padding: "6px 12px",
        background: "#1a1a2e",
        color: "#fff",
        borderRadius: 4,
        fontSize: 13,
        width: "640px",
      }}>
        {status}
      </div>

      {/* Legend */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        marginTop: 8,
        width: "640px",
      }}>
        {Object.entries(COLORS).map(([vehicle, color]) => (
          <div key={vehicle} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{
              width: 12, height: 12,
              background: color,
              borderRadius: 2,
            }} />
            <span style={{ fontSize: 12, textTransform: "capitalize" }}>{vehicle}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LiveCamera;