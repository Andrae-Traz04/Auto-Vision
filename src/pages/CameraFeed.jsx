import React, { useRef, useEffect } from "react";
import { useAutoVision } from "../hooks/useAutoVision";
import "../styles/CameraFeed.css";

function CameraFeed() {
  const videoRef = useRef(null);
  const { startCamera } = useAutoVision();

  useEffect(() => {
    async function enableCamera() {
      try {
        const stream = await startCamera();
        if (stream && videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera: ", err);
      }
    }
    enableCamera();
  }, [startCamera]);

  return (
    <div>
      <h2>Live Camera Feed</h2>
      <video ref={videoRef} autoPlay playsInline width="600" />
    </div>
  );
}

export default CameraFeed;
