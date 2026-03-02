import React, { useState } from "react";
import "../styles/UserManagement.css";

function UserManagement() {
  const [users, setUsers] = useState([
    { id: 1, name: "Tyler", role: "Admin" },
    { id: 2, name: "Dr. Robinson", role: "Operator" },
  ]);
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("Viewer");
  const [auditLog, setAuditLog] = useState([]);

  const addUser = () => {
    if (!newName.trim()) return;
    const newUser = {
      id: Date.now(),
      name: newName,
      role: newRole,
    };
    setUsers([...users, newUser]);
    setAuditLog([
      ...auditLog,
      { action: "Add User", user: newUser.name, role: newUser.role, time: new Date().toLocaleString() },
    ]);
    setNewName("");
    setNewRole("Viewer");
  };

  const removeUser = (id) => {
    const removedUser = users.find((u) => u.id === id);
    setUsers(users.filter((u) => u.id !== id));
    setAuditLog([
      ...auditLog,
      { action: "Remove User", user: removedUser.name, role: removedUser.role, time: new Date().toLocaleString() },
    ]);
  };

  const changeRole = (id, newRole) => {
    setUsers(
      users.map((u) =>
        u.id === id ? { ...u, role: newRole } : u
      )
    );
    const updatedUser = users.find((u) => u.id === id);
    setAuditLog([
      ...auditLog,
      { action: "Change Role", user: updatedUser.name, role: newRole, time: new Date().toLocaleString() },
    ]);
  };

  return (
    <div className="user-management">
      <h2>User Management</h2>

      {/* Add User Form */}
      <div className="add-user-form">
        <input
          type="text"
          placeholder="Enter name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
          <option>Admin</option>
          <option>Operator</option>
          <option>Viewer</option>
        </select>
        <button onClick={addUser}>Add User</button>
      </div>

      {/* User List */}
      <ul className="user-list">
        {users.map((user) => (
          <li key={user.id} className={`role-${user.role.toLowerCase()}`}>
            <span>{user.name} ({user.role})</span>
            <div className="user-actions">
              <select
                value={user.role}
                onChange={(e) => changeRole(user.id, e.target.value)}
              >
                <option>Admin</option>
                <option>Operator</option>
                <option>Viewer</option>
              </select>
              <button onClick={() => removeUser(user.id)}>Remove</button>
            </div>
          </li>
        ))}
      </ul>

      {/* Audit Log */}
      <div className="audit-log">
        <h3>Audit Trail</h3>
        <ul>
          {auditLog.map((log, idx) => (
            <li key={idx}>
              <strong>{log.action}</strong> - {log.user} ({log.role}) at {log.time}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default UserManagement;
