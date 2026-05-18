"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  ShieldCheck,
  Clock,
  Microscope,
  Stethoscope,
  ChevronRight,
  TrendingUp,
  Award,
  Star,
  Plus
} from "lucide-react";
import API from "@/services/api";
import Footer from "@/components/Footer";

// Sleek fallback static data in case backend database is buffering/offline on first boot
const DEFAULT_TESTS = [
  { _id: "t1", name: "Complete Blood Count (CBC)", code: "CBC", category: "Blood Test", price: 299, turnaroundTime: "12 Hours", sampleRequired: "Blood" },
  { _id: "t2", name: "Lipid Profile (Cholesterol)", code: "LIPID", category: "Heart Health", price: 599, turnaroundTime: "24 Hours", sampleRequired: "Blood" },
  { _id: "t3", name: "Thyroid Complete (T3, T4, TSH)", code: "THYROID", category: "Hormones", price: 799, turnaroundTime: "24 Hours", sampleRequired: "Blood" },
  { _id: "t4", name: "HbA1c Diabetes Profile", code: "HBA1C", category: "Diabetes", price: 399, turnaroundTime: "12 Hours", sampleRequired: "Blood" }
];

const DEFAULT_PACKAGES = [
  {
    _id: "p1",
    name: "Premium Full Body Health Checkup",
    code: "FHC",
    price: 1999,
    discountPrice: 1299,
    description: "Our complete baseline assessment tracking vital blood, heart, and metabolic indicators.",
    tests: ["CBC", "Lipid Profile", "Liver Screen"],
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop"
  },
  {
    _id: "p2",
    name: "Active Women Wellness Package",
    code: "WHP",
    price: 1799,
    discountPrice: 1199,
    description: "Specially curated checkup monitoring vital hormonal and vitamin levels for active lifestyles.",
    tests: ["Thyroid Screen", "Vitamin D3", "CBC"],
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop"
  }
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [tests, setTests] = useState(DEFAULT_TESTS);
  const [packages, setPackages] = useState(DEFAULT_PACKAGES);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const testRes = await API.get("/tests");
        if (testRes.data.status === "success" && testRes.data.data.length > 0) {
          setTests(testRes.data.data.slice(0, 4));
        }
      } catch (err) {
        console.warn("Could not query live tests, displaying pre-seeded details.");
      }

      try {
        const pkgRes = await API.get("/packages");
        if (pkgRes.data.status === "success" && pkgRes.data.data.length > 0) {
          setPackages(pkgRes.data.data.slice(0, 2));
        }
      } catch (err) {
        console.warn("Could not query live packages, displaying pre-seeded details.");
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="bg-white min-h-screen flex flex-col justify-between">
      <div>
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32 bg-slate-50">
          <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50/70 via-white to-white" />
          
          <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-6"
            >
              <div className="flex items-center gap-2 bg-blue-100/50 text-blue-600 px-4 py-2 rounded-2xl w-fit font-semibold text-xs border border-blue-200/20">
                <TrendingUp className="w-4 h-4" />
                <span>NABL & CAP Clinical Compliance Standards</span>
              </div>

              <h1 className="font-heading font-bold text-slate-900 text-4xl sm:text-5xl lg:text-6xl leading-tight">
                Advanced Lab Testing, <br />
                <span className="text-blue-600">Right at Your Doorstep.</span>
              </h1>

              <p className="text-slate-500 text-lg leading-relaxed max-w-lg">
                Accurate Reports, Trusted Care. Book comprehensive blood diagnostics and health packages with hygienic home collection across Gurugunta, Lingasugur, and Raichur district.
              </p>

              {/* Dynamic Live Search Bar */}
              <div className="relative mt-4 max-w-xl bg-white border border-slate-200 rounded-3xl p-2 shadow-xl shadow-slate-100 flex items-center gap-3">
                <div className="pl-4 text-slate-400">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="Search CBC, Vitamin, Full Body packages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-grow bg-transparent border-none outline-none text-slate-700 placeholder-slate-400 text-sm font-semibold py-2.5"
                />
                <Link
                  href={`/tests?q=${encodeURIComponent(searchQuery)}`}
                  className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 rounded-2xl text-xs font-bold transition-all shadow-md shadow-blue-600/10 shrink-0"
                >
                  Search
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-6 mt-8 border-t border-slate-100 pt-8">
                <div>
                  <h3 className="font-heading font-bold text-slate-800 text-2xl">50,000+</h3>
                  <p className="text-xs text-slate-400 font-semibold mt-1">Patients Served</p>
                </div>
                <div>
                  <h3 className="font-heading font-bold text-slate-800 text-2xl">100%</h3>
                  <p className="text-xs text-slate-400 font-semibold mt-1">NABL Accredited</p>
                </div>
                <div>
                  <h3 className="font-heading font-bold text-slate-800 text-2xl">24 Hours</h3>
                  <p className="text-xs text-slate-400 font-semibold mt-1">Max Turnaround</p>
                </div>
              </div>
            </motion.div>

            {/* Right Side Image illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="relative flex justify-center"
            >
              {/* Glassmorphic Badge */}
              <div className="absolute top-8 left-8 bg-white/80 backdrop-blur-md border border-slate-200/50 p-4 rounded-3xl shadow-xl flex items-center gap-3 z-20 animate-bounce">
                <div className="bg-emerald-500 p-2 rounded-2xl text-white">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold">Hygiene Certified</p>
                  <p className="text-sm font-bold text-slate-800">Home Collections</p>
                </div>
              </div>

              <div className="bg-blue-600/5 rounded-[40px] p-6 lg:p-8">
                <img
                  src="https://th.bing.com/th/id/OIP.LeUd66cbIEu5KtqWdU5fyQHaHF?r=0&o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3"
                  alt="Clinical Lab Diagnostics"
                  className="rounded-[30px] shadow-2xl max-w-full h-auto object-cover lg:h-[450px] w-full"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* TRUST BADGES & FEATURES */}
        <section className="px-6 py-20 bg-white">
          <div className="max-w-7xl mx-auto flex flex-col gap-16">
            <div className="text-center max-w-xl mx-auto flex flex-col gap-3">
              <span className="text-xs text-blue-600 font-bold uppercase tracking-wider">Accurate Diagnostics</span>
              <h2 className="font-heading font-bold text-slate-800 text-3xl sm:text-4xl">
                Premium Standards. Certified Care.
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                We combine industry-leading clinical methodologies with absolute client comfort.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:bg-white transition-all group">
                <div className="bg-blue-100 text-blue-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-md">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-slate-800 text-xl mb-3">Certified Accuracy</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  All tests are evaluated inside certified CAP & NABL accredited laboratories using robust state-of-the-art diagnostic machinery.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:bg-white transition-all group">
                <div className="bg-blue-100 text-blue-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-md">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-slate-800 text-xl mb-3">Rapid Reports</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Fast, readable PDF reports delivered directly to your secure Patient Dashboard and inbox within 12 to 24 hours of collection.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:bg-white transition-all group">
                <div className="bg-blue-100 text-blue-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-md">
                  <Microscope className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-slate-800 text-xl mb-3">Hygienic Home Visit</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Certified health phlebotomists collect blood samples safely right in your living room following sterile, single-use needle protocols.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* POPULAR HEALTH PACKAGES */}
        <section className="px-6 py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto flex flex-col gap-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
              <div className="max-w-md flex flex-col gap-3">
                <span className="text-xs text-blue-600 font-bold uppercase tracking-wider">Top Curated Packages</span>
                <h2 className="font-heading font-bold text-slate-800 text-3xl">Comprehensive Health Checkups</h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Bundle multiple diagnostic metrics together to save over 50% and track metabolic pathways.
                </p>
              </div>
              <Link
                href="/packages"
                className="group flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors shrink-0"
              >
                <span>View All Packages</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {packages.map((pkg) => (
                <div key={pkg._id} className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between">
                  <div className="relative h-56 w-full">
                    <img
                      src={pkg.image}
                      alt={pkg.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <span className="bg-blue-600 text-white font-bold text-[10px] px-2.5 py-1 rounded-md uppercase tracking-wider">
                        {pkg.code}
                      </span>
                      <h3 className="font-heading font-bold text-white text-xl mt-2">{pkg.name}</h3>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col gap-6 flex-grow justify-between">
                    <p className="text-slate-400 text-sm leading-relaxed">{pkg.description}</p>
                    
                    <div className="flex items-center justify-between border-t border-slate-100 pt-6 mt-4">
                      <div>
                        <span className="text-xs text-slate-400 line-through">₹{pkg.price}</span>
                        <h4 className="font-heading font-bold text-slate-800 text-2xl mt-0.5">₹{pkg.discountPrice}</h4>
                      </div>
                      
                      <Link
                        href={`/packages`}
                        className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Book Package</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* POPULAR INDIVIDUAL TESTS */}
        <section className="px-6 py-20 bg-white">
          <div className="max-w-7xl mx-auto flex flex-col gap-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
              <div className="max-w-md flex flex-col gap-3">
                <span className="text-xs text-blue-600 font-bold uppercase tracking-wider">Laboratory Catalog</span>
                <h2 className="font-heading font-bold text-slate-800 text-3xl">Popular Laboratory Tests</h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Individual diagnostics covering standard metabolic paths, vitamin checks, and glucose levels.
                </p>
              </div>
              <Link
                href="/tests"
                className="group flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors shrink-0"
              >
                <span>Browse Full Catalog</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {tests.map((test) => (
                <div key={test._id} className="bg-slate-50 border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:bg-white transition-all flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] bg-slate-200/50 text-slate-500 font-bold px-2 py-1 rounded-md uppercase tracking-wider border border-slate-200/20">
                      {test.category}
                    </span>
                    <h3 className="font-heading font-bold text-slate-800 text-base mt-4 line-clamp-1">{test.name}</h3>
                    <p className="text-slate-400 text-xs mt-2 font-medium">Turnaround: {test.turnaroundTime}</p>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100/60 pt-4 mt-6">
                    <div>
                      <span className="text-xs text-slate-400 block uppercase font-bold">Price</span>
                      <span className="font-heading font-bold text-slate-800 text-lg">₹{test.price}</span>
                    </div>
                    <Link
                      href="/tests"
                      className="bg-blue-600 text-white w-9 h-9 rounded-xl flex items-center justify-center shadow-md shadow-blue-600/10 hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4.5 h-4.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CLINICAL TESTIMONIALS */}
        <section className="px-6 py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto flex flex-col gap-16">
            <div className="text-center max-w-xl mx-auto flex flex-col gap-3">
              <span className="text-xs text-blue-600 font-bold uppercase tracking-wider">Patient Testimonials</span>
              <h2 className="font-heading font-bold text-slate-800 text-3xl sm:text-4xl">
                What Patients Say About Us
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm flex flex-col justify-between gap-6">
                <div className="flex gap-1 text-amber-400">
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <p className="text-slate-500 text-sm leading-relaxed italic">
                  "The phlebotomist was incredibly gentle and hygienic. I booked online at 9 AM, sample collected at 10 AM at my home in Lingasugur, and my CBC was ready on my dashboard by evening! 10/10 recommend."
                </p>
                <div className="flex items-center gap-3">
                  <div className="bg-slate-100 text-slate-600 w-10 h-10 rounded-full flex items-center justify-center font-bold">
                    RG
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-slate-800 text-sm">Rajesh Gowda</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Verified Patient</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm flex flex-col justify-between gap-6">
                <div className="flex gap-1 text-amber-400">
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <p className="text-slate-500 text-sm leading-relaxed italic">
                  "Having the health packages populate metrics in direct tables makes keeping track of my thyroid health extremely easy. Excellent diagnostic startup in Gurugunta."
                </p>
                <div className="flex items-center gap-3">
                  <div className="bg-slate-100 text-slate-600 w-10 h-10 rounded-full flex items-center justify-center font-bold">
                    SP
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-slate-800 text-sm">Sunita Patil</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Regular Client</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm flex flex-col justify-between gap-6">
                <div className="flex gap-1 text-amber-400">
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <p className="text-slate-500 text-sm leading-relaxed italic">
                  "Their customer service and NABL-grade laboratory compliance are outstanding. Perfect for local patients in Raichur seeking quality diagnostics at low rates."
                </p>
                <div className="flex items-center gap-3">
                  <div className="bg-slate-100 text-slate-600 w-10 h-10 rounded-full flex items-center justify-center font-bold">
                    KD
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-slate-800 text-sm">Dr. Kiran Deshpande</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Verified Patient</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}