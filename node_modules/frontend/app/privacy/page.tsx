"use client";

import React from "react";
import { ShieldCheck } from "lucide-react";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <div className="bg-slate-50 min-h-screen flex flex-col justify-between">
      <div>
        <div className="max-w-3xl mx-auto px-6 py-16 flex flex-col gap-12">
          
          {/* Header */}
          <div className="text-center max-w-xl mx-auto flex flex-col gap-3">
            <span className="text-xs text-blue-600 font-bold uppercase tracking-wider">Legal Terms</span>
            <h1 className="font-heading font-bold text-slate-800 text-3xl sm:text-4xl">Privacy & Data Security</h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Understand our security standards concerning patient diagnostics records.
            </p>
          </div>

          {/* Policy detail card */}
          <div className="bg-white border border-slate-200/50 rounded-3xl p-8 shadow-sm flex flex-col gap-6 text-xs text-slate-500 leading-relaxed">
            <div className="flex items-start gap-3 bg-blue-50/50 border border-blue-200/40 p-4 rounded-2xl">
              <ShieldCheck className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-800 text-sm leading-none">HIPAA Compliant Controls</h4>
                <p className="text-[10px] text-slate-500 mt-2">
                  All clinical test results, phlebotomist notes, and demographics are encrypted both in transit and at rest using banking-grade security protocols.
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-heading font-bold text-slate-800 text-sm mb-2">1. Health Data Protection</h3>
              <p>
                Multi Diagnostic Center restricts report catalog access strictly to the authenticated account holder and senior clinical pathologists. No healthcare statistics are shared with third-party networks without express diagnostic consent.
              </p>
            </div>

            <div>
              <h3 className="font-heading font-bold text-slate-800 text-sm mb-2">2. Phlebotomy Safety Notes</h3>
              <p>
                Home collection details (address coordinates, booking slots) are shared securely only with the assigned CAP-certified phlebotomist on the morning of collection to assure personal and diagnostic safety.
              </p>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
