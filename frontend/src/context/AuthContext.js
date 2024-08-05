import React, { createContext, useContext, useState, useCallback } from "react";
import * as api from "../services/api";
import setAuthToken from "../utils/setAuthToken";


const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token);
      try {
        const res = await api.getCurrentUser();
        setUser(res.data);
      } catch (err) {
        console.error("Error loading user", err);
        localStorage.removeItem("token");
        setAuthToken(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.login(email, password);
      localStorage.setItem("token", res.data.token);
      setAuthToken(res.data.token);
      setUser(res.data.user);
      return res.data.user;
    } catch (err) {
      throw new Error(
        err.response?.data?.msg || "An error occurred during login."
      );
    }
  };

  const googleLogin = async (tokenId) => {
    try {
      const response = await api.googleLogin({ tokenId });
      const { isNewUser, token, user } = response.data;
      localStorage.setItem("token", token);
      setUser(user);
      return { isNewUser, user };
    } catch (error) {
      console.error("Google login error:", error);
      throw new Error(
        error.response?.data?.msg || "An error occurred during Google login"
      );
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.register(userData);
      localStorage.setItem("token", res.data.token);
      setAuthToken(res.data.token);
      setUser(res.data.user);
      return res.data.user;
    } catch (err) {
      throw new Error(
        err.response?.data?.msg || "An error occurred during registration."
      );
    }
  };

  const logout = (callback) => {
    setUser(null);
    localStorage.removeItem("token");
    setAuthToken(null);
    if (callback) callback();
  };

  const value = {
    user,
    loading,
    login,
    register,
    googleLogin,
    logout,
    loadUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};