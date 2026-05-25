"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Activity, Calendar, FileText, Bell, ArrowRight, ShieldCheck, Microscope, Plus } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardSidebar from "@/components/DashboardSidebar";
import { useAuth } from "@/context/AuthContext";
import API from "@/services/api";


export default function PatientDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [reportsCount, setReportsCount] = useState(0);
  const [notificationsCount, setNotificationsCount] = useState(0);

  useEffect(() => {
    const fetchDashboardDetails = async () => {
      try {
        const appRes = await API.get("/appointments/my");
        if (appRes.data.status === "success") {
          setAppointments(appRes.data.data);
        }
      } catch {
        setAppointments([]);
      }

      try {
        const repRes = await API.get("/reports/my");
        if (repRes.data.status === "success") {
          setReportsCount(repRes.data.data.filter((r: any) => r.status === "Ready").length);
        }
      } catch {
        setReportsCount(0);
      }

      try {
        const notRes = await API.get("/notifications");
        if (notRes.data.status === "success") {
          setNotificationsCount(notRes.data.data.filter((n: any) => !n.read).length);
        }
      } catch {
        setNotificationsCount(0);
      }
    };

    fetchDashboardDetails();
  }, []);

  const ongoingBooking = appointments.find(app => ["Pending", "Confirmed", "Sample Collected"].includes(app.status)) || appointments[0];

  return (
    <ProtectedRoute allowedRoles={["patient"]}>
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Core Content */}
        <main className="flex-grow flex flex-col gap-8 overflow-hidden">
          
          {/* Welcome Card */}
          {user && (
            <div className="bg-slate-900 rounded-[32px] p-6 sm:p-8 text-white relative overflow-hidden shadow-lg shadow-slate-900/10">
              <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-900 to-slate-900" />
              
              <div className="relative z-10 flex flex-col gap-2 max-w-lg">
                <span className="text-[10px] bg-blue-600/35 border border-blue-500/20 px-2.5 py-1 rounded-md uppercase tracking-wider font-bold w-fit">
                  Patient Dashboard
                </span>
                <h1 className="font-heading font-bold text-2xl sm:text-3xl leading-snug mt-2">
                  Welcome Back, <br />
                  <span className="text-blue-400">{user.name}</span>
                </h1>
                <p className="text-slate-400 text-xs leading-relaxed mt-1">
                  Access clinical test metrics, view pending phlebotomy appointments, and download CAP/NABL accredited medical reports.
                </p>
              </div>
            </div>
          )}

          {/* Quick Metrics grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            {/* Tile 1 */}
            <div className="bg-white border border-slate-200/50 rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div className="bg-blue-50 text-blue-600 w-12 h-12 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Bookings</span>
                <span className="font-heading font-bold text-slate-800 text-2xl mt-0.5">{appointments.length}</span>
              </div>
            </div>

            {/* Tile 2 */}
            <div className="bg-white border border-slate-200/50 rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div className="bg-emerald-50 text-emerald-600 w-12 h-12 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Reports Ready</span>
                <span className="font-heading font-bold text-slate-800 text-2xl mt-0.5">{reportsCount}</span>
              </div>
            </div>

            {/* Tile 3 */}
            <div className="bg-white border border-slate-200/50 rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div className="bg-amber-50 text-amber-600 w-12 h-12 rounded-xl flex items-center justify-center">
                <Bell className="w-6 h-6 animate-swing" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">New Alerts</span>
                <span className="font-heading font-bold text-slate-800 text-2xl mt-0.5">{notificationsCount}</span>
              </div>
            </div>

          </div>

          {/* Ongoing appointment tracking stepper */}
          {ongoingBooking && (
            <div className="bg-white border border-slate-200/50 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6">
              <div>
                <h3 className="font-heading font-bold text-slate-800 text-base">Hygienic Booking Tracking</h3>
                <div className="h-0.5 w-8 bg-blue-600 mt-2 rounded-full" />
              </div>

              {/* Detail block */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <span className="text-[10px] bg-blue-100 text-blue-600 font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                    {ongoingBooking.type}
                  </span>
                  <h4 className="font-heading font-bold text-slate-800 text-base mt-2">
                    {ongoingBooking.packages?.[0]?.name || ongoingBooking.tests?.[0]?.name || "Diagnostic Checkup"}
                  </h4>
                  <p className="text-slate-400 text-xs mt-1">
                    Scheduled for {new Date(ongoingBooking.date).toLocaleDateString()} • {ongoingBooking.timeslot}
                  </p>
                </div>

                <div className="flex flex-col items-start sm:items-end gap-1">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Amount</span>
                  <span className="font-heading font-bold text-slate-800 text-xl">₹{ongoingBooking.totalAmount}</span>
                </div>
              </div>

              {/* Stepper Steps UI */}
              <div className="grid grid-cols-4 gap-2 relative pt-6 mt-4">
                
                {/* Connector line */}
                <div className="absolute top-[34px] left-[12.5%] right-[12.5%] h-0.5 bg-slate-100 z-0" />
                <div
                  className="absolute top-[34px] left-[12.5%] h-0.5 bg-blue-600 z-0 transition-all"
                  style={{
                    width:
                      ongoingBooking.status === "Pending"
                        ? "0%"
                        : ongoingBooking.status === "Confirmed"
                        ? "33.3%"
                        : ongoingBooking.status === "Sample Collected"
                        ? "66.6%"
                        : "100%",
                  }}
                />

                {/* Step 1 */}
                <div className="flex flex-col items-center text-center gap-2 relative z-10">
                  <div className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ring-4 ring-blue-50">
                    ✓
                  </div>
                  <span className="text-[10px] font-bold text-slate-800">Booked</span>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center text-center gap-2 relative z-10">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ring-4 ${
                    ["Confirmed", "Sample Collected", "Completed"].includes(ongoingBooking.status)
                      ? "bg-blue-600 text-white ring-blue-50"
                      : "bg-slate-100 text-slate-400 ring-slate-50"
                  }`}>
                    2
                  </div>
                  <span className={`text-[10px] font-bold ${
                    ["Confirmed", "Sample Collected", "Completed"].includes(ongoingBooking.status) ? "text-slate-800" : "text-slate-400"
                  }`}>Confirmed</span>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center text-center gap-2 relative z-10">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ring-4 ${
                    ["Sample Collected", "Completed"].includes(ongoingBooking.status)
                      ? "bg-blue-600 text-white ring-blue-50"
                      : "bg-slate-100 text-slate-400 ring-slate-50"
                  }`}>
                    3
                  </div>
                  <span className={`text-[10px] font-bold ${
                    ["Sample Collected", "Completed"].includes(ongoingBooking.status) ? "text-slate-800" : "text-slate-400"
                  }`}>Collected</span>
                </div>

                {/* Step 4 */}
                <div className="flex flex-col items-center text-center gap-2 relative z-10">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ring-4 ${
                    ongoingBooking.status === "Completed"
                      ? "bg-emerald-600 text-white ring-emerald-50"
                      : "bg-slate-100 text-slate-400 ring-slate-50"
                  }`}>
                    ✓
                  </div>
                  <span className={`text-[10px] font-bold ${
                    ongoingBooking.status === "Completed" ? "text-slate-800" : "text-slate-400"
                  }`}>Ready</span>
                </div>

              </div>

            </div>
          )}

          {/* Quick Shortcuts CTA */}
          <div className="grid sm:grid-cols-2 gap-6">
            
            <div className="bg-slate-50 border border-slate-200/40 rounded-3xl p-6 flex flex-col justify-between items-start gap-4">
              <div>
                <Microscope className="w-8 h-8 text-blue-600" />
                <h4 className="font-heading font-bold text-slate-800 text-sm mt-3">Book Laboratory Diagnostics</h4>
                <p className="text-slate-400 text-xs leading-relaxed mt-1">Schedule individual blood profiles or routine tests.</p>
              </div>
              <Link href="/tests" className="bg-white border border-slate-200 text-slate-700 hover:bg-blue-50 hover:text-blue-600 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2">
                <span>Search tests</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-slate-50 border border-slate-200/40 rounded-3xl p-6 flex flex-col justify-between items-start gap-4">
              <div>
                <Activity className="w-8 h-8 text-blue-600" />
                <h4 className="font-heading font-bold text-slate-800 text-sm mt-3">Comprehensive Wellness Packages</h4>
                <p className="text-slate-400 text-xs leading-relaxed mt-1">Save over 50% and track metabolic pathways in health bundles.</p>
              </div>
              <Link href="/packages" className="bg-white border border-slate-200 text-slate-700 hover:bg-blue-50 hover:text-blue-600 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2">
                <span>View packages</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

        </main>
      </div>
    </ProtectedRoute>
  );
}
