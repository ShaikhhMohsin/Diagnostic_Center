"use client";

import React from "react";
import { Microscope, Activity, ShieldCheck, Heart } from "lucide-react";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="bg-slate-50 min-h-screen flex flex-col justify-between">
      <div>
        <div className="max-w-4xl mx-auto px-6 py-16 flex flex-col gap-12">
          
          {/* Header */}
          <div className="text-center max-w-xl mx-auto flex flex-col gap-3">
            <span className="text-xs text-blue-600 font-bold uppercase tracking-wider">Our Laboratory</span>
            <h1 className="font-heading font-bold text-slate-800 text-3xl sm:text-4xl">About Multi Diagnostic</h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              We are a CAP & NABL accredited state-of-the-art diagnostic startup dedicated to delivering precise, reliable, and rapid healthcare insights.
            </p>
          </div>

          {/* Standards Grid */}
          <div className="grid md:grid-cols-2 gap-8 mt-4">
            <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-sm flex items-start gap-4">
              <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl flex-shrink-0">
                <Microscope className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-slate-800 text-base">Accredited Laboratory</h3>
                <p className="text-slate-400 text-xs leading-relaxed mt-2">
                  Our facilities are NABL accredited, assuring standard laboratory operating protocols (SOPs) and absolute calibration consistency across blood values.
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-sm flex items-start gap-4">
              <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl flex-shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-slate-800 text-base">CAP Quality Audited</h3>
                <p className="text-slate-400 text-xs leading-relaxed mt-2">
                  We participate in strict CAP external accuracy controls, assuring that diagnostic metrics are thoroughly checked by international regulatory bodies.
                </p>
              </div>
            </div>
          </div>

          {/* Local Origin and Advisory Board */}
          <div className="bg-white border border-slate-200/50 rounded-3xl p-8 shadow-sm flex flex-col gap-6">
            <div>
              <h3 className="font-heading font-bold text-slate-800 text-lg flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500 fill-current animate-pulse" />
                Founded by Ahmed Pasha
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed mt-2">
                Established by Ahmed Pasha in Gurugunta, Karnataka, Multi Diagnostic Center has become the benchmark for trusted diagnostic testing in the Raichur district. Our primary mission is to bridge the gap in clinical care by bringing world-class, NABL-grade pathology and home blood sample collection services directly to the Lingasugur taluka.
              </p>
              <p className="text-slate-500 text-xs leading-relaxed mt-3">
                Our operations are guided by a board of experienced senior pathologists and hematologists. Every report metric exceeding critical trigger ranges is immediately routed to our senior physician board for manual check and verification before being released on the secure dashboard.
              </p>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
