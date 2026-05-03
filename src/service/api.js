import axios from "axios";

// Base URL for the Django REST API (Loads dynamically from environment variables, falls back to the live Render backend)
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

// Create an Axios instance with default settings
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

export const authAPI = {
  register: (email, password) => api.post("/auth/register/", { email, password }),
  login: (email, password) => api.post("/auth/login/", { email, password }),
};

export const userAPI = {
  getAll: () => api.get("/users/"),
  add: (name, role) => api.post("/users/", { name, role }),
  remove: (id) => api.delete(`/users/${id}/`),
  updateRole: (id, role) => api.patch(`/users/${id}/`, { role }),
};

export const auditAPI = {
  getAll: () => api.get("/audit-logs/"),
  add: (action, user, role) => api.post("/audit-logs/", { action, user, role }),
};

export const deviceAPI = {
  getAll: () => api.get("/devices/"),
  add: (name, location, deviceId) => api.post("/devices/", { name, location, deviceId }),
  remove: (id) => api.delete(`/devices/${id}/`),
  updateStatus: (id, status) => api.patch(`/devices/${id}/`, { status }),
};

export default api;
