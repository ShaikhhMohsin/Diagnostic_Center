"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Layers, Stethoscope, CheckCircle, ArrowRight, ShieldAlert, Award, Star, Microscope } from "lucide-react";
import API from "@/services/api";
import Footer from "@/components/Footer";

const FALLBACK_PACKAGES = [
  {
    _id: "p1",
    name: "Premium Full Body Health Checkup",
    code: "PEHC",
    price: 1999,
    discountPrice: 1299,
    description: "Our complete baseline assessment tracking vital blood, heart, and metabolic indicators. Highly recommended for annual audits.",
    tests: [
      { name: "Complete Blood Count (CBC)", category: "Blood Test", sampleRequired: "Blood" },
      { name: "Lipid Profile (Cholesterol)", category: "Heart Health", sampleRequired: "Blood" },
      { name: "Liver Function Test (LFT)", category: "Liver Health", sampleRequired: "Blood" }
    ],
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop"
  },
  {
    _id: "p2",
    name: "Active Women Wellness Package",
    code: "WWHP",
    price: 1799,
    discountPrice: 1199,
    description: "Specially curated checkup monitoring vital hormonal and vitamin levels for active lifestyles and health parameters.",
    tests: [
      { name: "Thyroid Complete (T3, T4, TSH)", category: "Hormone Test", sampleRequired: "Blood" },
      { name: "Vitamin D3 (25-Hydroxy)", category: "Vitamins", sampleRequired: "Blood" },
      { name: "Complete Blood Count (CBC)", category: "Blood Test", sampleRequired: "Blood" }
    ],
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop"
  }
];

export default function PackagesPage() {
  const [packages, setPackages] = useState(FALLBACK_PACKAGES);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await API.get("/packages");
        if (res.data.status === "success" && res.data.data.length > 0) {
          setPackages(res.data.data);
        }
      } catch (err) {
        console.warn("Could not query live packages, falling back to static options.");
      }
    };
    fetchPackages();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col justify-between">
      <div>
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col gap-10">
          
          {/* Header */}
          <div className="border-b border-slate-200/60 pb-8 flex flex-col gap-3">
            <span className="text-xs text-blue-600 font-bold uppercase tracking-wider">Health Bundles</span>
            <h1 className="font-heading font-bold text-slate-800 text-3xl sm:text-4xl">Wellness Diagnostic Packages</h1>
            <p className="text-slate-400 text-sm">Monitor organic pathways, save over 50% on cost, and get compiled diagnostic metrics.</p>
          </div>

          {/* Grid Layout */}
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Packages List */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              {packages.map((pkg) => (
                <div key={pkg._id} className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col sm:flex-row">
                  {/* Left image banner */}
                  <div className="relative w-full sm:w-64 h-56 sm:h-auto flex-shrink-0">
                    <img
                      src={pkg.image}
                      alt={pkg.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent sm:hidden" />
                  </div>

                  {/* Body Content */}
                  <div className="p-6 sm:p-8 flex-grow flex flex-col justify-between gap-6">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="bg-blue-100 text-blue-600 font-bold text-[10px] px-2.5 py-1 rounded-md uppercase tracking-wider">
                          {pkg.code}
                        </span>
                        <span className="text-emerald-500 font-bold text-xs flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Accredited
                        </span>
                      </div>
                      <h3 className="font-heading font-bold text-slate-800 text-xl mt-3">{pkg.name}</h3>
                      <p className="text-slate-400 text-xs mt-2 leading-relaxed">{pkg.description}</p>
                      
                      {/* Tests included listing */}
                      <div className="mt-5">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">Tests Included ({pkg.tests?.length || 0})</h4>
                        <div className="flex flex-wrap gap-2">
                          {pkg.tests?.map((t: any, idx: number) => (
                            <span key={idx} className="bg-slate-50 border border-slate-200/50 px-2.5 py-1 rounded-lg text-[10px] font-semibold text-slate-500">
                              {t.name || t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-6 mt-2">
                      <div>
                        <span className="text-xs text-slate-400 line-through block">₹{pkg.price}</span>
                        <span className="font-heading font-bold text-slate-800 text-2xl mt-0.5">₹{pkg.discountPrice || pkg.price}</span>
                      </div>
                      
                      <Link
                        href={`/tests`}
                        className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-3.5 rounded-2xl text-xs font-bold transition-all shadow-md shadow-blue-500/10 flex items-center gap-2"
                      >
                        <span>Select in Catalog</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Why Bundle Sidebar */}
            <div className="flex flex-col gap-6">
              <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
                <div>
                  <h3 className="font-heading font-bold text-slate-800 text-base">Wellness Benefits</h3>
                  <div className="h-0.5 w-8 bg-blue-600 mt-2 rounded-full" />
                </div>

                <div className="flex flex-col gap-5 text-sm text-slate-500 leading-relaxed">
                  <div className="flex gap-3">
                    <Award className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5 animate-pulse" />
                    <p><strong>NABL Standards</strong>: All bundle tests are processed concurrently to assure systemic integrity.</p>
                  </div>
                  <div className="flex gap-3">
                    <Microscope className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5 animate-pulse" />
                    <p><strong>Comprehensive Checks</strong>: Complete view of blood values, hormonal status, and organ profiles.</p>
                  </div>
                  <div className="flex gap-3">
                    <Star className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5 animate-pulse" />
                    <p><strong>Massive Discount</strong>: Buying packages saves over 50% compared to buying individual parameters.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
