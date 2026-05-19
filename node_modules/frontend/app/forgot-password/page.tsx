"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Activity, Mail, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 flex items-center justify-center py-12 px-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-100/50 rounded-full blur-3xl" />

      <div className="w-full max-w-[440px] bg-white border border-slate-200/60 rounded-[32px] shadow-xl p-8 sm:p-10 relative z-10">
        
        {/* Logo */}
        <div className="flex flex-col items-center gap-2 mb-8 text-center">
          <div className="bg-blue-600 p-2.5 rounded-2xl text-white shadow-md shadow-blue-500/20">
            <Activity className="h-6 w-6" />
          </div>
          <h2 className="font-heading font-bold text-2xl text-slate-800 tracking-tight mt-2">Recover Password</h2>
          <p className="text-slate-400 text-xs font-semibold">Enter your email to receive a recovery token.</p>
        </div>

        {success ? (
          <div className="flex flex-col gap-6 items-center text-center">
            <div className="bg-emerald-100 text-emerald-600 p-4 rounded-full">
              <CheckCircle className="w-10 h-10" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-slate-800 text-base">Check Your Inbox</h3>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                If an account exists with {email}, we have sent a simulated verification token to recover access.
              </p>
            </div>
            <Link
              href="/login"
              className="bg-blue-600 text-white hover:bg-blue-700 py-3.5 rounded-2xl text-xs font-bold transition-all shadow-md w-full flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Login</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white hover:bg-blue-700 py-3.5 rounded-2xl text-xs font-bold transition-all shadow-md shadow-blue-500/10 cursor-pointer flex items-center justify-center gap-2 mt-4"
            >
              <span>Send Recovery Link</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="mt-8 text-center text-xs">
              <Link href="/login" className="font-bold text-slate-500 hover:text-slate-800 flex items-center justify-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
