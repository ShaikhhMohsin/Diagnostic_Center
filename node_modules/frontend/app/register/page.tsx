"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Activity, Mail, Lock, User, Phone, MapPin, UserCheck, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient" as "patient" | "admin",
    contactNumber: "",
    gender: "Male",
    age: "",
    street: "",
    city: "",
    state: "",
    zipCode: ""
  });
  const [error, setError] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);

  const { register } = useAuth();
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBtnLoading(true);

    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role,
      contactNumber: form.contactNumber,
      gender: form.gender,
      age: Number(form.age) || undefined,
      address: form.street ? {
        street: form.street,
        city: form.city,
        state: form.state,
        zipCode: form.zipCode
      } : undefined
    };

    try {
      const ok = await register(payload);
      if (ok) {
        if (form.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      } else {
        setError("Failed to register account.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Connection timed out or network error");
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 flex items-center justify-center py-12 px-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-100/50 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-emerald-50/50 rounded-full blur-3xl" />

      <div className="w-full max-w-[520px] bg-white border border-slate-200/60 rounded-[32px] shadow-xl p-8 sm:p-10 relative z-10">
        
        {/* Logo */}
        <div className="flex flex-col items-center gap-2 mb-8 text-center">
          <div className="bg-blue-600 p-2.5 rounded-2xl text-white shadow-md shadow-blue-500/20">
            <Activity className="h-6 w-6" />
          </div>
          <h2 className="font-heading font-bold text-2xl text-slate-800 tracking-tight mt-2">Create Account</h2>
          <p className="text-slate-400 text-xs font-semibold">Join Multi Diagnostic today.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 text-xs font-bold rounded-2xl p-4 flex items-start gap-2.5 mb-6">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-5">
          {/* Role selection toggle */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account Role</label>
            <div className="grid grid-cols-2 gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-1.5">
              <button
                type="button"
                onClick={() => setForm({ ...form, role: "patient" })}
                className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  form.role === "patient" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400"
                }`}
              >
                Patient Account
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, role: "admin" })}
                className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  form.role === "admin" ? "bg-white text-red-600 shadow-sm" : "text-slate-400"
                }`}
              >
                Administrator
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
              <div className="relative bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center gap-2.5">
                <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="bg-transparent border-none outline-none text-xs text-slate-700 placeholder-slate-400 flex-grow"
                  placeholder="Ramesh Kumar"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
              <div className="relative bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="bg-transparent border-none outline-none text-xs text-slate-700 placeholder-slate-400 flex-grow"
                  placeholder="ramesh@example.com"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
              <div className="relative bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="bg-transparent border-none outline-none text-xs text-slate-700 placeholder-slate-400 flex-grow"
                  placeholder="At least 6 chars"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contact Number</label>
              <div className="relative bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  required
                  value={form.contactNumber}
                  onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
                  className="bg-transparent border-none outline-none text-xs text-slate-700 placeholder-slate-400 flex-grow"
                  placeholder="+91 99000 12345"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Age</label>
              <input
                type="number"
                required
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs outline-none text-slate-700 w-full"
                placeholder="Years"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gender</label>
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs outline-none text-slate-700 w-full"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Optional Demographics Grid */}
          <div className="flex flex-col gap-3 border-t border-slate-100 pt-4">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              Address Details (Optional)
            </label>
            <input
              type="text"
              placeholder="Street Address"
              value={form.street}
              onChange={(e) => setForm({ ...form, street: e.target.value })}
              className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs outline-none text-slate-700 w-full"
            />
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="City"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs outline-none text-slate-700 w-full"
              />
              <input
                type="text"
                placeholder="State"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs outline-none text-slate-700 w-full"
              />
              <input
                type="text"
                placeholder="Zip"
                value={form.zipCode}
                onChange={(e) => setForm({ ...form, zipCode: e.target.value })}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs outline-none text-slate-700 w-full"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={btnLoading}
            className="bg-blue-600 text-white hover:bg-blue-700 py-3.5 rounded-2xl text-xs font-bold transition-all shadow-md shadow-blue-500/10 cursor-pointer flex items-center justify-center gap-2 mt-4"
          >
            {btnLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Register New Account</span>
                <UserCheck className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-blue-600 hover:text-blue-700">
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
}
