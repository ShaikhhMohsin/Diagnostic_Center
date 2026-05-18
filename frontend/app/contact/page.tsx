"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setForm({ name: "", email: "", message: "" });
      setSent(false);
      alert("Thank you! Your message has been sent successfully.");
    }, 1500);
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col justify-between">
      <div>
        <div className="max-w-4xl mx-auto px-6 py-16 flex flex-col gap-12">
          
          {/* Header */}
          <div className="text-center max-w-xl mx-auto flex flex-col gap-3">
            <span className="text-xs text-blue-600 font-bold uppercase tracking-wider">Support Coordinates</span>
            <h1 className="font-heading font-bold text-slate-800 text-3xl sm:text-4xl">Contact Laboratory Support</h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Have booking queries or want custom pathology testing packages? Get in touch with our team.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-4">
            {/* Coordinates info */}
            <div className="bg-white border border-slate-200/50 rounded-3xl p-8 shadow-sm flex flex-col gap-8">
              <div>
                <h3 className="font-heading font-bold text-slate-800 text-lg">Contact Info</h3>
                <div className="h-0.5 w-8 bg-blue-600 mt-2 rounded-full" />
              </div>

              <div className="flex flex-col gap-6 text-sm text-slate-500">
                <div className="flex gap-4">
                  <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5 animate-bounce" />
                  <div>
                    <span className="font-semibold text-slate-800 block">Accredited Laboratory Address</span>
                    <span className="mt-1 block">Near Ishwar Temple, Gurugunta, TQ Lingasugur, DT Raichur, Karnataka, India - 584139</span>
                  </div>
                </div>
                <div className="flex gap-4 items-center">
                  <Phone className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-800 block">Phone Support</span>
                    <span className="mt-0.5 block">+91 96205 89822</span>
                  </div>
                </div>
                <div className="flex gap-4 items-center">
                  <Mail className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-800 block">Email Support</span>
                    <a href="mailto:ahmedpasha@gmail.com" className="mt-0.5 block hover:text-blue-600 transition-colors">ahmedpasha@gmail.com</a>
                  </div>
                </div>
                <div className="flex gap-4 items-center border-t border-slate-100 pt-4">
                  <span className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full font-bold uppercase tracking-wider">Open 24/7</span>
                  <span className="text-xs text-slate-400 font-medium">Round-the-clock pathology diagnostic care</span>
                </div>
              </div>

              {/* High-fidelity Google Maps Mockup */}
              <div className="border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm relative h-48 bg-slate-100 flex flex-col justify-end">
                <div className="absolute inset-0 bg-cover bg-center opacity-85 hover:scale-105 transition-transform duration-500 cursor-pointer" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=600&auto=format&fit=crop')" }} />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                <div className="p-4 relative z-10 text-white flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">GURUGUNTA FACILITY</span>
                  <span className="font-bold text-xs leading-tight">Near Ishwar Temple, Gurugunta, Karnataka</span>
                  <a 
                    href="https://maps.google.com/?q=Gurugunta,Lingasugur,Raichur,Karnataka" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] font-bold text-white bg-blue-600 hover:bg-blue-700 w-fit px-3 py-1.5 rounded-lg shadow-md mt-1 transition-all"
                  >
                    Open in Google Maps
                  </a>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="bg-white border border-slate-200/50 rounded-3xl p-8 shadow-sm">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none text-slate-700 w-full"
                    placeholder="Enter your name"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none text-slate-700 w-full"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Message</label>
                  <textarea
                    rows={4}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none text-slate-700 w-full resize-none"
                    placeholder="Describe your request"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sent}
                  className="bg-blue-600 text-white hover:bg-blue-700 py-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-500/10 cursor-pointer w-full mt-2"
                >
                  {sent ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Sending message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
