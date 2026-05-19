"use client";

import React, { useState, useEffect } from "react";
import { Users, Mail, Phone, Calendar, UserCheck } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardSidebar from "@/components/DashboardSidebar";
import API from "@/services/api";

const FALLBACK_USERS = [
  { _id: "u-1", name: "John Doe", email: "patient@example.com", role: "patient", contactNumber: "+15550144", createdAt: new Date().toISOString() },
  { _id: "u-2", name: "Dr. Sarah Jenkins", email: "admin@multidiagnostic.com", role: "admin", contactNumber: "+15550199", createdAt: new Date().toISOString() }
];

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get("/auth/users");
        if (res.data.status === "success") {
          setUsers(res.data.data);
        }
      } catch (err) {
        console.warn("Could not query live users, displaying sandbox mockup.");
        setUsers(FALLBACK_USERS);
      }
    };
    fetchUsers();
  }, []);

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar */}
        <DashboardSidebar isAdmin={true} />

        {/* Core Content */}
        <main className="flex-grow flex flex-col gap-8 overflow-hidden">
          
          <div className="border-b border-slate-200/60 pb-6">
            <h1 className="font-heading font-bold text-slate-800 text-2xl">Registered Users</h1>
            <p className="text-slate-400 text-xs mt-1">Search profiles and review registration dates for both patients and administrators.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {users.map((user) => (
              <div key={user._id} className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-sm flex flex-col justify-between gap-6 hover:shadow-md transition-all">
                
                {/* Header */}
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-slate-800 text-sm leading-snug">{user.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider border mt-1 block w-fit ${
                        user.role === "admin"
                          ? "bg-red-50 text-red-600 border-red-100"
                          : "bg-blue-50 text-blue-600 border-blue-100"
                      }`}>
                        {user.role}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details list */}
                <div className="flex flex-col gap-3 text-xs text-slate-500 font-semibold border-t border-slate-50 pt-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span>{user.contactNumber}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>Registered: {new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </main>
      </div>
    </ProtectedRoute>
  );
}
