import React, { useRef, useEffect } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
import { useAutoVision } from "../hooks/useAutoVision";
import "../styles/LiveCamera.css";

function LiveCamera({ deviceId }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const { startCamera } = useAutoVision();

  useEffect(() => {
    let model;

    const initCamera = async () => {
      const stream = await startCamera(deviceId);
      if (stream && videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    };

    const loadModel = async () => {
      model = await cocoSsd.load();
      detectFrame();
    };

    const detectFrame = async () => {
      if (videoRef.current && videoRef.current.readyState === 4 && model) {
        const predictions = await model.detect(videoRef.current);
        const ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, 640, 480);

        predictions.forEach((prediction) => {
          if (["car", "truck", "bus", "motorcycle"].includes(prediction.class)) {
            ctx.strokeStyle = "red";
            ctx.lineWidth = 2;
            ctx.strokeRect(...prediction.bbox);
            ctx.fillStyle = "red";
            ctx.fillText(
              prediction.class,
              prediction.bbox[0],
              prediction.bbox[1] > 10 ? prediction.bbox[1] - 5 : 10
            );
          }
        });
      }
      requestAnimationFrame(detectFrame);
    };

    initCamera();
    loadModel();
  }, [deviceId, startCamera]);

  return (
    <div style={{ position: "relative", width: "640px", height: "480px" }}>
      <video ref={videoRef} width="640" height="480" style={{ position: "absolute" }} />
      <canvas ref={canvasRef} width="640" height="480" style={{ position: "absolute" }} />
    </div>
  );
}

export default LiveCamera;
