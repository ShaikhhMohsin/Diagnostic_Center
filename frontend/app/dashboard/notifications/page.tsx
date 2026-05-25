"use client";

import React, { useState, useEffect } from "react";
import { Bell, Check, Trash2 } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardSidebar from "@/components/DashboardSidebar";
import API from "@/services/api";


export default function PatientNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await API.get("/notifications");
        if (res.data.status === "success") {
          setNotifications(res.data.data);
        }
      } catch {
        setNotifications([]);
      }
    };
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      const res = await API.put(`/notifications/${id}/read`);
      if (res.data.status === "success") {
        setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
      }
    } catch {
      // optimistic local update
      setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
    }
  };

  return (
    <ProtectedRoute allowedRoles={["patient"]}>
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Core Content */}
        <main className="flex-grow flex flex-col gap-8 overflow-hidden">
          
          <div className="border-b border-slate-200/60 pb-6 flex justify-between items-center">
            <div>
              <h1 className="font-heading font-bold text-slate-800 text-2xl">Clinical Notifications</h1>
              <p className="text-slate-400 text-xs mt-1">Stay updated with appointments transitions and clinical results releases.</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {notifications.map((n) => (
              <div
                key={n._id}
                className={`bg-white border rounded-2xl p-5 shadow-sm flex justify-between items-start gap-4 transition-all ${
                  n.read ? "border-slate-200/50 opacity-70" : "border-blue-200/60 ring-2 ring-blue-50/50"
                }`}
              >
                <div className="flex gap-3">
                  <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${n.read ? "bg-slate-100 text-slate-400" : "bg-blue-50 text-blue-600"}`}>
                    <Bell className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-slate-800 text-sm">{n.title}</h3>
                    <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">{n.message}</p>
                    <span className="text-[10px] text-slate-400 mt-2 block font-medium">
                      {new Date(n.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                {!n.read && (
                  <button
                    onClick={() => handleMarkRead(n._id)}
                    className="bg-slate-50 border border-slate-200 hover:bg-blue-50 hover:text-blue-600 p-2 rounded-xl transition-all cursor-pointer shrink-0"
                    title="Mark as Read"
                  >
                    <Check className="w-4 h-4 text-slate-500" />
                  </button>
                )}
              </div>
            ))}

            {notifications.length === 0 && (
              <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center shadow-sm">
                <Bell className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="font-heading font-bold text-slate-800 text-lg">No Notifications</h3>
                <p className="text-slate-400 text-sm mt-2">Any clinical test updates or booking changes will show up here.</p>
              </div>
            )}
          </div>

        </main>
      </div>
    </ProtectedRoute>
  );
}
