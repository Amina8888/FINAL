import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

type UserRole = "guest" | "User" | "Specialist";

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  userRole: UserRole;
  userId: string | null;
  login: (token: string, role: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getInitialRole = (): UserRole => {
  const role = localStorage.getItem("user_role");
  if (role === "User" || role === "Specialist") return role;
  return "guest";
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("auth_token"));
  const [userRole, setUserRole] = useState<UserRole>(getInitialRole);
  const [userId, setUserId] = useState<string | null>(null);

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
  
  const login = (newToken: string, role: string) => {
    const decoded = jwtDecode<{ sub: string }>(newToken);
    const uid = decoded.sub;

    setToken(newToken);
    setUserId(uid);
    setUserRole(role as UserRole);

    localStorage.setItem("auth_token", newToken);
    localStorage.setItem("user_role", role);
  };

  const logout = () => {
    setToken(null);
    setUserRole("guest");
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: !!token, userRole, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
