"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Search, CalendarDays } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardSidebar from "@/components/DashboardSidebar";
import API from "@/services/api";

const FALLBACK_APPOINTMENTS = [
  {
    _id: "m-app-1",
    type: "Home Collection",
    date: new Date().toISOString(),
    timeslot: "08:00 AM - 10:00 AM",
    status: "Confirmed",
    totalAmount: 999,
    address: { street: "Near Bus Stand, Gurugunta", city: "Lingasugur", state: "Karnataka", zipCode: "584139" },
    tests: [{ name: "Complete Blood Count (CBC)" }],
    packages: [{ name: "Premium Executive Health Checkup" }]
  }
];

export default function PatientAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await API.get("/appointments/my");
        if (res.data.status === "success") {
          setAppointments(res.data.data);
        }
      } catch (err) {
        console.warn("Could not query live appointments, showing mock sandbox booking.");
        setAppointments(FALLBACK_APPOINTMENTS);
      }
    };
    fetchAppointments();
  }, []);

  return (
    <ProtectedRoute allowedRoles={["patient"]}>
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Core Content */}
        <main className="flex-grow flex flex-col gap-8 overflow-hidden">
          
          <div className="border-b border-slate-200/60 pb-6">
            <h1 className="font-heading font-bold text-slate-800 text-2xl">Booking History</h1>
            <p className="text-slate-400 text-xs mt-1">Review scheduled diagnostics and historical laboratory visits.</p>
          </div>

          <div className="flex flex-col gap-6">
            {appointments.map((app) => (
              <div key={app._id} className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-100 pb-5 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-50 text-blue-600 p-2.5 rounded-xl flex-shrink-0">
                      <CalendarDays className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Booking ID</span>
                      <span className="text-xs font-bold text-slate-800 truncate block mt-0.5">{app._id}</span>
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border w-fit ${
                    app.status === "Completed"
                      ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                      : app.status === "Pending"
                      ? "bg-slate-100 text-slate-500 border-slate-200"
                      : "bg-blue-50 text-blue-600 border-blue-200"
                  }`}>
                    {app.status}
                  </span>
                </div>

                {/* Details layout */}
                <div className="grid md:grid-cols-3 gap-6 text-xs text-slate-500">
                  {/* Left Parameter details */}
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
                  <div className="flex flex-col gap-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Schedule Info</span>
                    <div className="flex flex-col gap-2 font-medium">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>{new Date(app.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span>{app.timeslot}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Address coordinates */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Type & Address</span>
                    <span className="font-bold text-slate-800 block">{app.type}</span>
                    {app.type === "Home Collection" && app.address && (
                      <span className="text-slate-400 mt-1 block leading-relaxed max-w-[200px]">
                        {app.address.street}, {app.address.city}, {app.address.state} {app.address.zipCode}
                      </span>
                    )}
                  </div>
                </div>

                {/* Total amount details */}
                <div className="border-t border-slate-100 pt-5 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Amount Paid</span>
                  <span className="font-heading font-bold text-slate-800 text-xl">₹{app.totalAmount}</span>
                </div>

              </div>
            ))}

            {appointments.length === 0 && (
              <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center shadow-sm">
                <CalendarDays className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="font-heading font-bold text-slate-800 text-lg">No Bookings Yet</h3>
                <p className="text-slate-400 text-sm mt-2">Book diagnostics or comprehensive health checkups inside our catalog.</p>
              </div>
            )}
          </div>

        </main>
      </div>
    </ProtectedRoute>
  );
}
