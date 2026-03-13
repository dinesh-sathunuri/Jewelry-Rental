// src/context/AuthContext.jsx
import { createContext, useContext, useState } from "react";
import { adminApi } from "../api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const savedAdmin = localStorage.getItem("admin");
    return savedAdmin ? JSON.parse(savedAdmin) : null;
  });

  const login = async (credentials) => {
    try {
      const { username, password } = credentials;
      const response = await adminApi.login(username, password);
      const { id, username: returnedUsername } = response.data;
      if (!id || !returnedUsername) throw new Error("Invalid admin data");

      const adminData = { id, username: returnedUsername };
      setAdmin(adminData);
      // Store admin info for UI
      localStorage.setItem("admin", JSON.stringify(adminData));
      // Store credentials so the interceptor can attach Basic Auth to future requests
      localStorage.setItem("adminCredentials", JSON.stringify({ username, password }));
      return adminData;
    } catch (error) {
      console.error("Login failed:", error.message);
      throw error;
    }
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem("admin");
    localStorage.removeItem("adminCredentials");
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