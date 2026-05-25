"use client";

import React, { useState, useEffect } from "react";
import { CalendarDays, Calendar, Clock, MapPin } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardSidebar from "@/components/DashboardSidebar";
import API from "@/services/api";


export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);

  const fetchAppointments = async () => {
    try {
      const res = await API.get("/appointments");
      if (res.data.status === "success") {
        setAppointments(res.data.data);
      }
    } catch {
      setAppointments([]);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await API.put(`/appointments/${id}/status`, { status: newStatus });
      if (res.data.status === "success") {
        setAppointments(appointments.map(a => a._id === id ? { ...a, status: newStatus } : a));
      }
    } catch {
      // optimistic local update
      setAppointments(appointments.map(a => a._id === id ? { ...a, status: newStatus } : a));
    }
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar */}
        <DashboardSidebar isAdmin={true} />

        {/* Core Content */}
        <main className="flex-grow flex flex-col gap-8 overflow-hidden">
          
          <div className="border-b border-slate-200/60 pb-6">
            <h1 className="font-heading font-bold text-slate-800 text-2xl">Appointment Ledger</h1>
            <p className="text-slate-400 text-xs mt-1">Review full logs, verify demographic coordinates, and update phlebotomist status triggers.</p>
          </div>

          <div className="flex flex-col gap-6">
            {appointments.map((app) => (
              <div key={app._id} className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-sm flex flex-col gap-6 hover:shadow-md transition-all">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-100 pb-5 gap-4">
                  <div>
                    <h3 className="font-heading font-bold text-slate-800 text-sm leading-snug">{app.user?.name || "Anonymous Patient"}</h3>
                    <p className="text-slate-400 text-[10px] font-semibold mt-0.5">{app.user?.email}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Status:</span>
                    <select
                      value={app.status}
                      onChange={(e) => handleUpdateStatus(app._id, e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[10px] text-slate-700 font-bold outline-none cursor-pointer"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Sample Collected">Sample Collected</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>

                {/* Details layout */}
                <div className="grid md:grid-cols-3 gap-6 text-xs text-slate-500">
                  
                  {/* Left parameter details */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Booked Diagnostics</span>
                    <ul className="flex flex-col gap-1.5 font-semibold text-slate-700">
                      {app.packages?.map((p: any, idx: number) => (
                        <li key={idx} className="list-disc list-inside text-blue-600 truncate">{p.name}</li>
                      ))}
                      {app.tests?.map((t: any, idx: number) => (
                        <li key={idx} className="list-disc list-inside truncate">{t.name}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Mid Schedule details */}
                  <div className="flex flex-col gap-3 font-medium">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Schedule Info</span>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span>{new Date(app.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span>{app.timeslot}</span>
                    </div>
                  </div>

                  {/* Right demographic visit coordinates */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Type & Demographics</span>
                    <span className="font-bold text-slate-800">{app.type}</span>
                    {app.type === "Home Collection" && app.address && (
                      <span className="text-slate-400 mt-1 block leading-relaxed">
                        {app.address.street}, {app.address.city}, {app.address.state} {app.address.zipCode}
                      </span>
                    )}
                  </div>

                </div>

                {/* Total amount details */}
                <div className="border-t border-slate-100 pt-5 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Total Amount</span>
                  <span className="font-heading font-bold text-slate-800 text-xl">₹{app.totalAmount}</span>
                </div>

              </div>
            ))}
          </div>

        </main>
      </div>
    </ProtectedRoute>
  );
}
