import { createContext, useContext, useState, useCallback } from "react";
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
      console.log("Attempting login with:", { email });
      const res = await api.login(email, password);
      console.log("API response:", res); 

      if (!res || !res.token) {
        throw new Error("Invalid response from server");
      }

      localStorage.setItem("token", res.token);
      setAuthToken(res.token);
      const userData = res.user || res; 
      console.log("Setting user:", userData);
      setUser(userData);

      return userData;
    } catch (err) {
      console.error("Login error details:", err);
      throw new Error(
        err.response?.data?.msg || "An error occurred during login."
      );
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.register(userData);
      localStorage.setItem("token", res.token);
      setAuthToken(res.token);
      setUser(res.user);
      return res.user;
    } catch (err) {
      if (err.response && err.response.status === 409) {
        throw new Error(
          "This email is already registered. Please try logging in instead."
        );
      }
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
    setUser,
    loading,
    login,
    register,
    logout,
    loadUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
