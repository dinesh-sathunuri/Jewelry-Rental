// src/context/AuthContext.jsx
import { createContext, useContext, useState } from "react";
import { adminApi } from "../api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    // Initialize from localStorage if available (for persistence)
    const savedAdmin = localStorage.getItem("admin");
    return savedAdmin ? JSON.parse(savedAdmin) : null;
  });

  const login = async (credentials) => {
    try {
      const response = await adminApi.login(credentials);
      const { id, username } = response.data;
      if (!id || !username) throw new Error("Invalid admin data");
      const adminData = { id, username };
      setAdmin(adminData);
      localStorage.setItem("admin", JSON.stringify(adminData)); // Persist admin data
      return adminData;
    } catch (error) {
      console.error("Login failed:", error.message);
      throw error; // Let the caller handle the error
    }
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem("admin"); // Clear persisted data
  };

  const register = async (request) => {
    try {
      const response = await adminApi.register(request);
      const { id, username } = response.data;
      if (!id || !username) throw new Error("Invalid admin data");
      const adminData = { id, username };
      setAdmin(adminData);
      localStorage.setItem("admin", JSON.stringify(adminData));
      return adminData;
    } catch (error) {
      console.error("Registration failed:", error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};