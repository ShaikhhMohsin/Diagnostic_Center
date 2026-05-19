"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Activity } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<"patient" | "admin">;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirection based on role
        if (user.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      }
    }
  }, [user, loading, router, allowedRoles]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="relative flex flex-col items-center">
          {/* Pulsing Medical Glow */}
          <div className="absolute w-24 h-24 bg-blue-100 rounded-full blur-xl animate-pulse" />
          
          <Activity className="w-16 h-16 text-blue-600 animate-bounce relative z-10" />
          
          <h2 className="text-xl font-bold text-slate-800 mt-6 relative z-10">
            Multi Diagnostic Center
          </h2>
          <p className="text-sm text-slate-400 mt-2 animate-pulse relative z-10">
            Securing clinical session...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
