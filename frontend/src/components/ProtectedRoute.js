import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, adminOnly }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || (adminOnly && user.userType !== "admin")) {
    return <Navigate to="/auth" />;
  }

  return children;
};

export default ProtectedRoute;
