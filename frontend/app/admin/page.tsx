"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp, Users, Microscope, Calendar, ClipboardCheck, ArrowUpRight, DollarSign, Activity } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardSidebar from "@/components/DashboardSidebar";
import API from "@/services/api";


export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);

  const fetchAdminDetails = async () => {
    try {
      const statsRes = await API.get("/analytics");
      if (statsRes.data.status === "success") {
        setStats(statsRes.data.data);
      }
    } catch {
      // backend not available
    }

    try {
      const appRes = await API.get("/appointments");
      if (appRes.data.status === "success") {
        setAppointments(appRes.data.data);
      }
    } catch {
      setAppointments([]);
    }
  };

  useEffect(() => {
    fetchAdminDetails();
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
            <h1 className="font-heading font-bold text-slate-800 text-2xl">Administrative Analytics</h1>
            <p className="text-slate-400 text-xs mt-1">Global operations review, diagnostic revenue, and active phlebotomy queues.</p>
          </div>

          {/* Stats Widgets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Widget 1 */}
            <div className="bg-white border border-slate-200/50 rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div className="bg-emerald-50 text-emerald-600 w-12 h-12 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Revenue</span>
                <span className="font-heading font-bold text-slate-800 text-xl mt-0.5">₹{stats?.totalRevenue ?? 0}</span>
              </div>
            </div>

            {/* Widget 2 */}
            <div className="bg-white border border-slate-200/50 rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div className="bg-blue-50 text-blue-600 w-12 h-12 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Patients</span>
                <span className="font-heading font-bold text-slate-800 text-xl mt-0.5">{stats?.totalUsers ?? 0}</span>
              </div>
            </div>

            {/* Widget 3 */}
            <div className="bg-white border border-slate-200/50 rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div className="bg-purple-50 text-purple-600 w-12 h-12 rounded-xl flex items-center justify-center">
                <Microscope className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Completed Assays</span>
                <span className="font-heading font-bold text-slate-800 text-xl mt-0.5">{stats?.totalTestsCount ?? 0}</span>
              </div>
            </div>

            {/* Widget 4 */}
            <div className="bg-white border border-slate-200/50 rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div className="bg-amber-50 text-amber-600 w-12 h-12 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Active Visits</span>
                <span className="font-heading font-bold text-slate-800 text-xl mt-0.5">{stats?.pendingAppointmentsCount ?? 0}</span>
              </div>
            </div>

          </div>

          {/* Quick Active Bookings Tracker Table */}
          <div className="bg-white border border-slate-200/50 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6">
            <div>
              <h3 className="font-heading font-bold text-slate-800 text-base">Active Phlebotomy Queue</h3>
              <div className="h-0.5 w-8 bg-blue-600 mt-2 rounded-full" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-semibold text-slate-700">
                <thead>
                  <tr className="border-b border-slate-100 pb-3 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                    <th className="py-3">Patient</th>
                    <th className="py-3">Booking Medium</th>
                    <th className="py-3">Date / Slot</th>
                    <th className="py-3">Amount</th>
                    <th className="py-3 text-right">Status Controls</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((app) => (
                    <tr key={app._id} className="border-b border-slate-50/50 items-center">
                      <td className="py-4">
                        <div>
                          <p className="font-bold text-slate-800">{app.user?.name || "Anonymous Patient"}</p>
                          <p className="text-[10px] text-slate-400 font-medium mt-0.5">{app.user?.email}</p>
                        </div>
                      </td>
                      <td className="py-4 text-slate-500 font-medium">{app.type}</td>
                      <td className="py-4">
                        <p>{new Date(app.date).toLocaleDateString()}</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">{app.timeslot}</p>
                      </td>
                      <td className="py-4 font-bold text-slate-800">₹{app.totalAmount}</td>
                      <td className="py-4 text-right">
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </ProtectedRoute>
  );
}
