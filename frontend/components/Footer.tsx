"use client";

import React from "react";
import Link from "next/link";
import { Activity, ShieldCheck, Mail, Phone, MapPin } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand Section */}
        <div className="flex flex-col gap-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-blue-600 p-2.5 rounded-2xl text-white shadow-lg shadow-blue-500/20">
              <Activity className="w-6 h-6" />
            </div>
            <span className="font-heading text-xl font-bold text-white tracking-tight">
              Multi Diagnostic
            </span>
          </Link>
          <p className="text-slate-400 text-sm leading-relaxed">
            State-of-the-art diagnostic laboratory offering premium blood testing, wellness checks, and safe home sample collections.
          </p>
          <div className="flex items-center gap-3 text-emerald-400 bg-slate-800/50 px-4 py-2.5 rounded-2xl w-fit border border-emerald-500/10">
            <ShieldCheck className="w-5 h-5 flex-shrink-0" />
            <span className="text-xs font-semibold tracking-wide">CAP & NABL ACCREDITED LAB</span>
          </div>
        </div>

        {/* Diagnostic Services */}
        <div>
          <h4 className="text-white font-heading font-bold mb-6 tracking-wide text-sm uppercase">
            Popular Tests
          </h4>
          <ul className="space-y-4 text-sm text-slate-400">
            <li>
              <Link href="/tests" className="hover:text-blue-400 transition-colors">Complete Blood Count (CBC)</Link>
            </li>
            <li>
              <Link href="/tests" className="hover:text-blue-400 transition-colors">Lipid Profile Cardiovascular</Link>
            </li>
            <li>
              <Link href="/tests" className="hover:text-blue-400 transition-colors">Thyroid Profile (T3, T4, TSH)</Link>
            </li>
            <li>
              <Link href="/tests" className="hover:text-blue-400 transition-colors">Liver Function Evaluation</Link>
            </li>
            <li>
              <Link href="/packages" className="hover:text-blue-400 transition-colors">Comprehensive Full Body Checkup</Link>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-heading font-bold mb-6 tracking-wide text-sm uppercase">
            Quick Links
          </h4>
          <ul className="space-y-4 text-sm text-slate-400">
            <li>
              <Link href="/about" className="hover:text-blue-400 transition-colors">About Our Laboratory</Link>
            </li>
            <li>
              <Link href="/home-collection" className="hover:text-blue-400 transition-colors">Home Sample Collection</Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-blue-400 transition-colors">Contact Support</Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-blue-400 transition-colors">Frequently Asked FAQs</Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy & Terms</Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-white font-heading font-bold mb-6 tracking-wide text-sm uppercase">
            Get in Touch
          </h4>
          <ul className="space-y-4 text-sm text-slate-400">
            <li className="flex gap-3">
              <MapPin className="w-5 h-5 text-blue-500 flex-shrink-0 animate-bounce" />
              <span>Near Ishwar Temple, Gurugunta, TQ Lingasugur, DT Raichur, Karnataka, India - 584139</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <span>+91 96205 89822</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <a href="mailto:ahmedpasha@gmail.com" className="hover:text-blue-400 transition-colors">ahmedpasha@gmail.com</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800 bg-slate-950/40 py-6 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Multi Diagnostic Center. All rights reserved. Created with clinical-grade safety standards.</p>
      </div>
    </footer>
  );
};

export default Footer;
