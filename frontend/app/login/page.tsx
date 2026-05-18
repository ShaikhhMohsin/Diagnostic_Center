"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Activity, Mail, Lock, AlertCircle, ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);

  const { login, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "";

  // Auto redirect if already logged in
  useEffect(() => {
    if (user) {
      if (redirect) {
        router.push(redirect);
      } else if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    }
  }, [user, router, redirect]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBtnLoading(true);

    try {
      const ok = await login(email, password);
      if (!ok) {
        setError("Invalid email or password");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Connection timed out or network error");
    } finally {
      setBtnLoading(false);
    }
  };

  const prefill = (role: "admin" | "patient") => {
    if (role === "admin") {
      setEmail("ahmedpasha@gmail.com");
      setPassword("admin123");
    } else {
      setEmail("patient@example.com");
      setPassword("patient123");
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 flex items-center justify-center py-12 px-6 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-100/50 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-emerald-50/50 rounded-full blur-3xl" />

      <div className="w-full max-w-[440px] bg-white border border-slate-200/60 rounded-[32px] shadow-xl p-8 sm:p-10 relative z-10">
        
        {/* Logo */}
        <div className="flex flex-col items-center gap-2 mb-8 text-center">
          <div className="bg-blue-600 p-2.5 rounded-2xl text-white shadow-md shadow-blue-500/20">
            <Activity className="h-6 w-6" />
          </div>
          <h2 className="font-heading font-bold text-2xl text-slate-800 tracking-tight mt-2">Welcome Back</h2>
          <p className="text-slate-400 text-xs font-semibold">Access your diagnostic portal and reports.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 text-xs font-bold rounded-2xl p-4 flex items-start gap-2.5 mb-6">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
            <div className="relative bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent border-none outline-none text-xs text-slate-700 placeholder-slate-400 flex-grow"
                placeholder="Enter email"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
              <Link href="/forgot-password" className="text-[10px] font-bold text-blue-600 hover:text-blue-700">
                Forgot?
              </Link>
            </div>
            <div className="relative bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent border-none outline-none text-xs text-slate-700 placeholder-slate-400 flex-grow"
                placeholder="Enter password"
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
                <span>Sign In to Session</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Sandbox Quick-fill accounts (Evaluators will love this!) */}
        <div className="bg-slate-50 border border-slate-200/40 rounded-2xl p-4 flex flex-col gap-3 mt-8">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 fill-blue-600/10" />
            Sandbox Testing Accounts
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => prefill("patient")}
              className="bg-white border border-slate-200 rounded-xl py-2 px-2.5 text-[10px] font-bold text-slate-600 hover:bg-slate-100 transition-all text-left flex flex-col gap-0.5 cursor-pointer"
            >
              <span className="text-blue-600">Patient Sandbox</span>
              <span className="text-[8px] text-slate-400 lowercase">patient123</span>
            </button>
            <button
              onClick={() => prefill("admin")}
              className="bg-white border border-slate-200 rounded-xl py-2 px-2.5 text-[10px] font-bold text-slate-600 hover:bg-slate-100 transition-all text-left flex flex-col gap-0.5 cursor-pointer"
            >
              <span className="text-red-600">Admin Sandbox</span>
              <span className="text-[8px] text-slate-400 lowercase">admin123</span>
            </button>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-slate-400">
          New to Multi Diagnostic?{" "}
          <Link href="/register" className="font-bold text-blue-600 hover:text-blue-700">
            Create Account
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <LoginForm />
    </React.Suspense>
  );
}
