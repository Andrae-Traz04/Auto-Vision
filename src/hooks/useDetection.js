import { useState, useEffect, useRef } from 'react';
import { detectFrame } from '../service/detectionService';

export function useDetection(videoRef) {
  const [boxes, setBoxes] = useState([]);
  const isDetecting = useRef(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!videoRef.current || isDetecting.current) return;
      isDetecting.current = true;

      try {
        // Capture frame from video element into canvas
        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);

        // Convert to blob and send
        canvas.toBlob(async (blob) => {
          const detections = await detectFrame(blob);
          setBoxes(detections);
          isDetecting.current = false;
        }, 'image/jpeg', 0.6);

      } catch (err) {
        console.error('Detection error:', err);
        isDetecting.current = false;
      }
    }, 300);

    return () => clearInterval(interval);
  }, [videoRef]);

  return boxes;
}