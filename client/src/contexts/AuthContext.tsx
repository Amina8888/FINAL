// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

type UserRole = "guest" | "user" | "consultant";

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  userRole: UserRole;
  login: (token: string, role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("auth_token"));
  const [userRole, setUserRole] = useState<UserRole>(() => (localStorage.getItem("user_role") as UserRole) || "guest");

  useEffect(() => {
    if (token) {
      localStorage.setItem("auth_token", token);
      localStorage.setItem("user_role", userRole);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_role");
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token, userRole]);

  const login = (newToken: string, role: UserRole) => {
    setToken(newToken);
    setUserRole(role);
  };

  const logout = () => {
    setToken(null);
    setUserRole("guest");
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: !!token, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
