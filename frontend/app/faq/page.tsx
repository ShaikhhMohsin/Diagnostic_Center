"use client";

import React, { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import Footer from "@/components/Footer";

const FAQS_LIST = [
  {
    q: "How do I schedule a home sample collection appointment?",
    a: "Browse the 'Tests' or 'Packages' tabs, choose your required diagnostics, select a convenient date and time-slot, fill in your phlebotomy collection address, and confirm booking. A phlebotomist will call prior to the visit."
  },
  {
    q: "Do I need to fast before sample collection?",
    a: "Many standard diagnostic panels like Liver Screens and Lipid Profiles require fasting for 10 to 12 hours before sampling. You can check preparation notes directly on each test description in our catalog."
  },
  {
    q: "How long does it take to get laboratory test results?",
    a: "Standard diagnostics like blood counts and glucose readings take between 12 to 24 hours. Specialized endocrine tests might require up to 48 hours. Reports will immediately trigger notifications and populate in your reports portal."
  },
  {
    q: "Are your laboratory facilities NABL accredited?",
    a: "Yes. All samples collected undergo processing inside fully accredited CAP and NABL laboratories following international accuracy check parameters."
  }
];

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col justify-between">
      <div>
        <div className="max-w-3xl mx-auto px-6 py-16 flex flex-col gap-12">
          
          {/* Header */}
          <div className="text-center max-w-xl mx-auto flex flex-col gap-3">
            <span className="text-xs text-blue-600 font-bold uppercase tracking-wider">Help Accordion</span>
            <h1 className="font-heading font-bold text-slate-800 text-3xl sm:text-4xl">Frequently Asked FAQs</h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Find fast responses to common diagnostic preparation and booking queries.
            </p>
          </div>

          {/* Accordion List */}
          <div className="flex flex-col gap-4 mt-4">
            {FAQS_LIST.map((faq, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-200/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                >
                  <button
                    onClick={() => toggle(idx)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between font-heading font-bold text-sm text-slate-800 gap-4 cursor-pointer"
                  >
                    <span className="flex items-center gap-3">
                      <HelpCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      {faq.q}
                    </span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 text-slate-500 text-xs leading-relaxed border-t border-slate-50/50 pl-14">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
