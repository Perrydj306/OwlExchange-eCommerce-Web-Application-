import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();

  // Block access if not logged in
  if (!user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // If user tries to access /admin but isn’t an admin
  if (location.pathname.startsWith("/admin") && user.role !== "Admin") {
    return <Navigate to="/dashboard" replace />;
  }

  // Allow access otherwise
  return children;
};

export default ProtectedRoute;
