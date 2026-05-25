"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import API from "@/services/api";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "patient" | "admin";
  contactNumber: string;
  gender?: string;
  age?: number;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: any) => Promise<boolean>;
  isMockMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      if (typeof window !== "undefined") {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));

          // Verify token against local backend
          try {
            const res = await API.get("/auth/me");
            if (res.data.status === "success") {
              setUser(res.data.data);
              localStorage.setItem("user", JSON.stringify(res.data.data));
            }
          } catch {
            // Token invalid or backend offline — force logout
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setToken(null);
            setUser(null);
          }
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });
      if (res.data.status === "success") {
        const { token: userToken, data: userData } = res.data;
        localStorage.setItem("token", userToken);
        localStorage.setItem("user", JSON.stringify(userData));
        setToken(userToken);
        setUser(userData);
        setLoading(false);
        return true;
      }
      setLoading(false);
      return false;
    } catch (error: any) {
      setLoading(false);
      throw error;
    }
  };

  const register = async (userData: any): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await API.post("/auth/register", userData);
      if (res.data.status === "success") {
        const { token: userToken, data: registeredData } = res.data;
        localStorage.setItem("token", userToken);
        localStorage.setItem("user", JSON.stringify(registeredData));
        setToken(userToken);
        setUser(registeredData);
        setLoading(false);
        return true;
      }
      setLoading(false);
      return false;
    } catch (error: any) {
      setLoading(false);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    router.push("/login");
  };

  const updateProfile = async (profileData: any): Promise<boolean> => {
    try {
      const res = await API.put("/auth/profile", profileData);
      if (res.data.status === "success") {
        const { data: updatedData } = res.data;
        localStorage.setItem("user", JSON.stringify(updatedData));
        setUser(updatedData);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Update profile failed:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateProfile, isMockMode: false }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
