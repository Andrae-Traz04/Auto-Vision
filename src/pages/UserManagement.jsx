import React, { useState } from "react";
import { useAutoVision } from "../hooks/useAutoVision";
import "../styles/UserManagement.css";

function UserManagement() {
  // Use the custom hook for the "Add User" form inputs
  const { formData, handleInputChange, resetForm } = useAutoVision();
  
  const [users, setUsers] = useState([
    { id: 1, name: "Tyler", role: "Admin" },
    { id: 2, name: "Dr. Robinson", role: "Operator" },
  ]);
  
  const [auditLog, setAuditLog] = useState([]);

  // Helper to add entry to Audit Trail
  const addLogEntry = (action, userName, role) => {
    const entry = {
      action,
      user: userName,
      role: role,
      time: new Date().toLocaleString(),
    };
    setAuditLog((prev) => [entry, ...prev]); // Newest logs at the top
  };

  const addUser = () => {
    if (!formData.newName?.trim()) return;

    const newUser = {
      id: Date.now(),
      name: formData.newName,
      role: formData.newRole || "Viewer",
    };

    setUsers([...users, newUser]);
    addLogEntry("Add User", newUser.name, newUser.role);
    resetForm(); // Clears the input fields using the hook
  };

  const removeUser = (id) => {
    const target = users.find((u) => u.id === id);
    if (!target) return;

    setUsers(users.filter((u) => u.id !== id));
    addLogEntry("Remove User", target.name, target.role);
  };

  const changeRole = (id, updatedRole) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, role: updatedRole } : u)));
    
    const target = users.find((u) => u.id === id);
    addLogEntry("Change Role", target.name, updatedRole);
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