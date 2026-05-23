const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
const API_URL = `${API_BASE_URL}/detection/detect`;

export async function detectFrame(blob) {
  const formData = new FormData();
  formData.append('file', blob, 'frame.jpg');

  const response = await fetch(API_URL, {
    method: 'POST',
    body: formData,
  });

  const result = await response.json();
  return result.detections || [];
}