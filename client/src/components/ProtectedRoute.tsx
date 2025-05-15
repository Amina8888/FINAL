import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, userRole } = useAuth();
  const location = useLocation();
  console.log("🛡️ ProtectedRoute check:", {
    isAuthenticated,
    userRole,
    allowedRoles,
  });
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600 text-lg">Access denied. Insufficient permissions.</p>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
