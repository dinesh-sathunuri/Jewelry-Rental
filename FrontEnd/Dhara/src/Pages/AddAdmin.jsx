import { useState } from "react";
import { adminApi } from "../api";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
export default function AddAdmin() {
  const [newAdmin, setNewAdmin] = useState({ username: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setError("");

    if (newAdmin.password !== newAdmin.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      
      await adminApi.register({ username: newAdmin.username, password: newAdmin.password });
      alert("Admin added successfully!");
      navigate("/admin/dashboard");
    } catch (error) {
      setError("Failed to create admin: " + error.message);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="admin-form">
        <h2>Add New Admin</h2>
        <form onSubmit={handleAddAdmin}>
          <label>
            Username:
            <input
              type="text"
              value={newAdmin.username}
              onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
              placeholder="Enter username"
              required
            />
          </label>
          <label>
            Password:
            <div className="input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                value={newAdmin.password}
                onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>
          <label>
            Confirm Password:
            <div className="input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={newAdmin.confirmPassword}
                onChange={(e) => setNewAdmin({ ...newAdmin, confirmPassword: e.target.value })}
                placeholder="Confirm password"
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>
          {error && <p className="error">{error}</p>}
          <button type="submit">Add Admin</button>
        </form>
      </div>
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background-color: #f5f5f5;
        }

        .dashboard-container {
          margin-left: 300px;
          padding: 1.5rem;
          min-height: 100vh;
        }

        .admin-form {
          max-width: 500px;
          margin: 2rem auto;
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgb(0 0 0 / 0.1);
          height: fit-content;
        }

        .admin-form h2 {
          font-size: 1.8rem;
          font-weight: 600;
          color: #1a1a1a;
          text-align: center;
          margin-bottom: 2rem;
        }

        .admin-form form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .admin-form label {
          font-weight: 500;
          color: #4b5563;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          font-size: 0.95rem;
        }

        .admin-form .input-wrapper {
          position: relative;
        }

        .admin-form input {
          padding: 0.75rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 0.95rem;
          background: #fff;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          width: 100%;
        }

        .admin-form input:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgb(37 99 235 / 0.1);
        }

        .admin-form .toggle-password {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.9rem;
          color: #4b5563;
          padding: 0.2rem;
        }

        .admin-form .toggle-password:hover {
          color: #2563eb;
        }

        .admin-form button[type="submit"] {
          background-color: #2563eb;
          color: white;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.3s ease, transform 0.2s ease;
        }

        .admin-form button[type="submit"]:hover {
          background-color: #1e40af;
          transform: translateY(-2px);
        }

        .admin-form .error {
          color: #ef4444;
          font-size: 0.9rem;
          text-align: center;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .dashboard-container {
            margin-left: 0;
            padding: 1rem;
          }

          .admin-form {
            margin: 1rem;
            padding: 1.5rem;
          }

          .admin-form input {
            font-size: 0.9rem;
          }
        }

        @media (max-width: 480px) {
          .admin-form {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}