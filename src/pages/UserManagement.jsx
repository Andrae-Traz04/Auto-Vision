import React, { useState, useEffect } from "react";
import { userAPI, auditAPI } from "../service/api";
import { useAutoVision } from "../hooks/useAutoVision";
import "../styles/UserManagement.css";

function UserManagement() {
  // Use the custom hook for the "Add User" form inputs
  const { formData, handleInputChange, resetForm } = useAutoVision();

  const [users, setUsers] = useState([]);
  const [auditLog, setAuditLog] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await userAPI.getAll();
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const res = await auditAPI.getAll();
      setAuditLog(res.data);
    } catch (error) {
      console.error("Failed to fetch audit logs:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchAuditLogs();
  }, []);


  const addLogEntry = async (action, userName, role) => {
    try {
      await auditAPI.add(action, userName, role);
      fetchAuditLogs(); // Refresh logs list to get newest from the backend
    } catch (error) {
      console.error("Failed to post audit log:", error);
    }
  };

  const addUser = async () => {
    if (!formData.newName?.trim()) return;

    try {
      const res = await userAPI.add(formData.newName, formData.newRole || "Viewer");

      const newUser = res.data;
      setUsers([...users, newUser]);
      addLogEntry("Add User", newUser.name, newUser.role);
      resetForm(); // Clears the input fields using the hook
    } catch (error) {
      console.error("Failed to add user:", error);
    }
  };

  const removeUser = async (id) => {
    const target = users.find((u) => u.id === id);
    if (!target) return;

    try {
      await userAPI.remove(id);

      setUsers(users.filter((u) => u.id !== id));
      addLogEntry("Remove User", target.name, target.role);
    } catch (error) {
      console.error("Failed to remove user:", error);
    }
  };

  const changeRole = async (id, updatedRole) => {
    const target = users.find((u) => u.id === id);
    if (!target) return;

    try {
      await userAPI.updateRole(id, updatedRole);

      setUsers(
        users.map((u) => (u.id === id ? { ...u, role: updatedRole } : u))
      );
      addLogEntry("Change Role", target.name, updatedRole);
    } catch (error) {
      console.error("Failed to update role:", error);
    }
  };

  return (
    <div className="user-management">
      <h2>User Management</h2>

      {/* --- Add User Section --- */}
      <div className="add-user-form">
        <input
          type="text"
          name="newName" // Must match the property in formData
          placeholder="Enter name"
          value={formData.newName || ""}
          onChange={handleInputChange}
        />
        <select
          name="newRole"
          value={formData.newRole || "Viewer"}
          onChange={handleInputChange}
        >
          <option value="Admin">Admin</option>
          <option value="Operator">Operator</option>
          <option value="Viewer">Viewer</option>
        </select>
        <button onClick={addUser} className="add-btn">Add User</button>
      </div>

      {/* --- User List Section --- */}
      <ul className="user-list">
        {users.map((user) => (
          <li key={user.id} className={`role-${user.role.toLowerCase()}`}>
            <div className="user-info">
              <strong>{user.name}</strong>
              <span className="role-badge">{user.role}</span>
            </div>
            <div className="user-actions">
              <select
                value={user.role}
                onChange={(e) => changeRole(user.id, e.target.value)}
              >
                <option value="Admin">Admin</option>
                <option value="Operator">Operator</option>
                <option value="Viewer">Viewer</option>
              </select>
              <button onClick={() => removeUser(user.id)} className="remove-btn">
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* --- Audit Trail Section --- */}
      <div className="audit-log">
        <h3>System Audit Trail</h3>
        <div className="log-scroll-area">
          {auditLog.length === 0 ? (
            <p className="empty-log">No recent activity.</p>
          ) : (
            <ul>
              {auditLog.map((log, idx) => (
                <li key={idx}>
                  <span className="log-time">[{log.time}]</span>{" "}
                  <strong>{log.action}:</strong> {log.user} assigned as {log.role}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserManagement;