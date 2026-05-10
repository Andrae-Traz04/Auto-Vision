const API_URL = "http://127.0.0.1:8000/api/detection/detect"; // ← your IP

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