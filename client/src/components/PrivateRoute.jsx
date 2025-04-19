
import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = true; // Replace with real auth logic
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
