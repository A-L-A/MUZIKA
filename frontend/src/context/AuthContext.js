import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import setAuthToken from "../utils/setAuthToken";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        setAuthToken(token);
        try {
          const res = await axios.get("/login"); 
          setUser(res.data);
        } catch (err) {
          console.error("Error loading user", err);
          localStorage.removeItem("token");
          setAuthToken(null);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post("/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setAuthToken(res.data.token);
      setUser(res.data.user);
      return res.data.user;
    } catch (err) {
      throw err.response.data.msg;
    }
  };

  const register = async (userData) => {
    try {
      const res = await axios.post("/signup", userData);
      localStorage.setItem("token", res.data.token);
      setAuthToken(res.data.token);
      setUser(res.data.user);
      return res.data.user;
    } catch (err) {
      throw err.response.data.msg;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuthToken(null);
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
