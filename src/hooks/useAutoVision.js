import { useState,  useCallback } from "react";

export const useAutoVision = () => {
  // --- FORM LOGIC ---
  const [formData, setFormData] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => setFormData({});

  // --- CAMERA LOGIC ---
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);

  const startCamera = useCallback(async (deviceId = null) => {
    const constraints = deviceId 
      ? { video: { deviceId: { exact: deviceId } } } 
      : { video: true };
    
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      return mediaStream;
    } catch (err) {
      setError("Camera Access Denied");
      console.error(err);
    }
  }, []);

  return {
    formData,
    handleInputChange,
    resetForm,
    stream,
    error,
    startCamera
  };
};