import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:5000/api/admin";
  axios.defaults.withCredentials = true;

  const checkAuth = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/check-auth`);
      if (data.success) {
        setAdmin(data.admin);
      }
    } catch (error) {
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post(`${API_URL}/login`, { email, password });
      if (data.success) {
        setAdmin(data.admin);
        toast.success(data.message);
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      return false;
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/logout`);
      setAdmin(null);
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
