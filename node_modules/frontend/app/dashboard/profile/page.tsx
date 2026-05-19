"use client";

import React, { useState, useEffect } from "react";
import { User, Phone, MapPin, CheckCircle } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardSidebar from "@/components/DashboardSidebar";
import { useAuth } from "@/context/AuthContext";

export default function PatientProfile() {
  const { user, updateProfile } = useAuth();
  
  const [form, setForm] = useState({
    name: "",
    contactNumber: "",
    age: "",
    gender: "Male",
    street: "",
    city: "",
    state: "",
    zipCode: ""
  });
  
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        contactNumber: user.contactNumber || "",
        age: user.age ? String(user.age) : "",
        gender: user.gender || "Male",
        street: user.address?.street || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
        zipCode: user.address?.zipCode || ""
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(false);
    setSuccess(false);

    const payload = {
      contactNumber: form.contactNumber,
      age: Number(form.age) || undefined,
      gender: form.gender,
      address: {
        street: form.street,
        city: form.city,
        state: form.state,
        zipCode: form.zipCode
      }
    };

    try {
      const ok = await updateProfile(payload);
      if (ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      alert("Failed to update profile settings.");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["patient"]}>
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Core Content */}
        <main className="flex-grow flex flex-col gap-8 overflow-hidden">
          
          <div className="border-b border-slate-200/60 pb-6">
            <h1 className="font-heading font-bold text-slate-800 text-2xl">Profile Settings</h1>
            <p className="text-slate-400 text-xs mt-1">Configure demographic profiles and default home collection coordinates.</p>
          </div>

          {success && (
            <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl p-4 flex items-center gap-2.5">
              <CheckCircle className="w-5 h-5 shrink-0" />
              <span className="text-xs font-semibold">Demographics successfully updated.</span>
            </div>
          )}

          <div className="bg-white border border-slate-200/50 rounded-3xl p-6 sm:p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-xl">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                  <div className="relative bg-slate-50 border border-slate-200/50 rounded-2xl p-3 flex items-center gap-2.5 opacity-70">
                    <User className="w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      disabled
                      value={form.name}
                      className="bg-transparent border-none outline-none text-xs text-slate-600 flex-grow cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contact Number</label>
                  <div className="relative bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={form.contactNumber}
                      onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
                      className="bg-transparent border-none outline-none text-xs text-slate-700 placeholder-slate-400 flex-grow"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Age (Years)</label>
                  <input
                    type="number"
                    required
                    value={form.age}
                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                    className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-700 outline-none w-full font-semibold"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gender</label>
                  <select
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-700 outline-none w-full font-semibold"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Address details */}
              <div className="flex flex-col gap-3 border-t border-slate-100 pt-5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  Default Collection Address
                </label>
                <input
                  type="text"
                  placeholder="Street Address"
                  value={form.street}
                  onChange={(e) => setForm({ ...form, street: e.target.value })}
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs outline-none text-slate-700 w-full font-semibold"
                />
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="City"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs outline-none text-slate-700 w-full font-semibold"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs outline-none text-slate-700 w-full font-semibold"
                  />
                  <input
                    type="text"
                    placeholder="Zip"
                    value={form.zipCode}
                    onChange={(e) => setForm({ ...form, zipCode: e.target.value })}
                    className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs outline-none text-slate-700 w-full font-semibold"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-2xl text-xs font-bold transition-all shadow-md shadow-blue-500/10 cursor-pointer w-full sm:w-fit px-8 mt-2"
              >
                Save Settings
              </button>

            </form>
          </div>

        </main>
      </div>
    </ProtectedRoute>
  );
}
