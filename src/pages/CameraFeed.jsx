import React, { useRef, useEffect } from "react";
import "../styles/CameraFeed.css";

function CameraFeed() {
  const videoRef = useRef(null);

  useEffect(() => {
    async function enableCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Error accessing camera: ", err);
      }
    }
    enableCamera();
  }, []);

  return (
    <div>
      <h2>Live Camera Feed</h2>
      <video ref={videoRef} autoPlay playsInline width="600" />
    </div>
  );
}

export default CameraFeed;
