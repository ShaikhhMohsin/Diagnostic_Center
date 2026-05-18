"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Snowflake, Calendar, ArrowRight, UserCheck, Thermometer } from "lucide-react";
import Footer from "@/components/Footer";

export default function HomeCollectionPage() {
  return (
    <div className="bg-slate-50 min-h-screen flex flex-col justify-between">
      <div>
        <div className="max-w-4xl mx-auto px-6 py-16 flex flex-col gap-12">
          
          {/* Header */}
          <div className="text-center max-w-xl mx-auto flex flex-col gap-4">
            <span className="text-xs text-blue-600 font-bold uppercase tracking-wider">Hygienic Home Visit</span>
            <h1 className="font-heading font-bold text-slate-800 text-3xl sm:text-4xl">Safe Home Sample Collection</h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Skip the queues. Get clinical phlebotomy experts to collect blood samples safely right in your living room or office workspace.
            </p>
          </div>

          {/* Stepper Steps */}
          <div className="grid md:grid-cols-3 gap-8 mt-4">
            
            {/* Step 1 */}
            <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
              <div className="bg-blue-50 text-blue-600 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h3 className="font-heading font-bold text-slate-800 text-base">Book Diagnostic</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Select your required tests or wellness packages in our catalog and configure a convenient date/time slot.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
              <div className="bg-blue-50 text-blue-600 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h3 className="font-heading font-bold text-slate-800 text-base">Hygienic Sampling</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                A certified phlebotomist visits with sterile vacuum containers and collects samples using single-use needle protocols.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
              <div className="bg-blue-50 text-blue-600 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h3 className="font-heading font-bold text-slate-800 text-base">Online Report</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Samples undergo NABL validation inside our laboratory. Access ready PDF metrics in your secure patient portal within 12-24 hours.
              </p>
            </div>

          </div>

          {/* Sterile & Cold Chain logistics details */}
          <div className="bg-white border border-slate-200/50 rounded-3xl p-8 shadow-sm flex flex-col md:flex-row gap-8 items-center mt-6">
            <div className="w-24 h-24 bg-blue-100/50 rounded-full flex items-center justify-center text-blue-600 flex-shrink-0">
              <Snowflake className="w-10 h-10 animate-spin" />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-heading font-bold text-slate-800 text-lg flex items-center gap-2">
                <Thermometer className="w-5 h-5 text-blue-600" />
                Temperature Controlled Cold Chain Logistics
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Crucially, blood enzymes decay if kept at ambient room temperatures. All multi-diagnostic home samples are encapsulated inside medical cold bags maintained between 2°C and 8°C during transit to prevent metric deterioration.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-center text-white flex flex-col items-center gap-6 shadow-xl mt-6 relative overflow-hidden">
            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/35 via-slate-900 to-slate-900" />
            
            <div className="relative z-10 flex flex-col gap-4 max-w-md">
              <h2 className="font-heading font-bold text-2xl sm:text-3xl leading-tight">Ready to Schedule a Safe Home Sample Collection?</h2>
              <p className="text-slate-400 text-xs leading-relaxed">
                Access over 100 individual lab tests and fully discounted diagnostic bundles with safe home visits.
              </p>
            </div>

            <Link
              href="/tests"
              className="relative z-10 bg-blue-600 text-white hover:bg-blue-700 px-8 py-4 rounded-full text-xs font-bold shadow-lg shadow-blue-600/10 transition-all flex items-center gap-2"
            >
              <span>Schedule Phlebotomy Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
