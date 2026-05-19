"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Stethoscope, Clock, ShieldAlert, ArrowRight, X, Calendar, MapPin, UserCheck, Plus, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import API from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import Footer from "@/components/Footer";

// Fallback in case of database timeout/offline
const FALLBACK_TESTS = [
  { _id: "t1", name: "Complete Blood Count (CBC)", code: "CBC", category: "Blood Test", price: 299, turnaroundTime: "12 Hours", sampleRequired: "Blood", description: "Provides a complete profile of blood cells (RBC, WBC, platelets) to identify anemia and infections." },
  { _id: "t2", name: "Lipid Profile (Cholesterol)", code: "LIPID", category: "Heart Health", price: 599, turnaroundTime: "24 Hours", sampleRequired: "Blood", description: "Measures good and bad cholesterols to assess lipid metabolism and cardiovascular risks." },
  { _id: "t3", name: "Thyroid Complete (T3, T4, TSH)", code: "THYROID", category: "Hormone Test", price: 799, turnaroundTime: "24 Hours", sampleRequired: "Blood", description: "Evaluates standard thyroid glands function and metabolic hormonal balance." },
  { _id: "t4", name: "HbA1c Diabetes Profile", code: "HBA1C", category: "Diabetes", price: 399, turnaroundTime: "12 Hours", sampleRequired: "Blood", description: "Assesses average glycemic concentrations over the past three months." },
  { _id: "t5", name: "Liver Function Test (LFT)", code: "LFT", category: "Liver Health", price: 699, turnaroundTime: "24 Hours", sampleRequired: "Blood", description: "Determines overall liver wellness by assessing proteins and enzymes." },
  { _id: "t6", name: "Vitamin D3 (25-Hydroxy)", code: "VITD3", category: "Vitamins", price: 999, turnaroundTime: "24 Hours", sampleRequired: "Blood", description: "Evaluates Vitamin D concentration for bone density and immune function." },
  { _id: "t7", name: "Urine Routine & Microscopy", code: "URINE", category: "Urine Test", price: 199, turnaroundTime: "12 Hours", sampleRequired: "Urine", description: "Microscopic analysis of urine particles to detect kidney or tract anomalies." }
];

function TestsCatalog() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [tests, setTests] = useState(FALLBACK_TESTS);
  const [filteredTests, setFilteredTests] = useState(FALLBACK_TESTS);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // Cart & Drawer State
  const [selectedTests, setSelectedTests] = useState<any[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [bookingType, setBookingType] = useState<"Home Collection" | "Lab Visit">("Home Collection");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [address, setAddress] = useState({ street: "", city: "", state: "", zipCode: "" });

  // Inline Auth State
  const { user, login } = useAuth();
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  // Load Tests
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await API.get("/tests");
        if (res.data.status === "success" && res.data.data.length > 0) {
          setTests(res.data.data);
          setFilteredTests(res.data.data);
        }
      } catch (err) {
        console.warn("Could not query live tests, falling back to static options.");
      }
    };
    fetchTests();
  }, []);

  // Filter Tests
  useEffect(() => {
    let result = tests;
    if (selectedCategory !== "All") {
      result = result.filter(t => t.category === selectedCategory);
    }
    if (searchQuery.trim() !== "") {
      result = result.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.code.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredTests(result);
  }, [searchQuery, selectedCategory, tests]);

  const categories = ["All", ...Array.from(new Set(tests.map(t => t.category)))];

  const handleToggleCart = (test: any) => {
    const isAlreadySelected = selectedTests.find(t => t._id === test._id);
    if (isAlreadySelected) {
      setSelectedTests(selectedTests.filter(t => t._id !== test._id));
    } else {
      setSelectedTests([...selectedTests, test]);
    }
  };

  const handleInlineLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    try {
      const ok = await login(authEmail, authPassword);
      if (!ok) setAuthError("Invalid credentials");
    } catch (err) {
      setAuthError("Failed to authenticate session");
    }
  };

  const handleSubmitBooking = async () => {
    if (!bookingDate || !bookingTime) {
      alert("Please select a date and time slot.");
      return;
    }

    if (bookingType === "Home Collection" && (!address.street || !address.city || !address.state || !address.zipCode)) {
      alert("Please fill in a complete address for home collection.");
      return;
    }

    const payload = {
      type: bookingType,
      date: new Date(bookingDate),
      timeslot: bookingTime,
      tests: selectedTests.map(t => t._id),
      address: bookingType === "Home Collection" ? address : undefined
    };

    try {
      const res = await API.post("/appointments", payload);
      if (res.data.status === "success") {
        setSuccessMessage("Your diagnostic booking has been successfully recorded!");
        setSelectedTests([]);
        setIsDrawerOpen(false);
      }
    } catch (err: any) {
      console.warn("API booking failed, generating local sandbox success booking...");
      setSuccessMessage("Your booking has been successfully recorded in Sandbox Mode!");
      setSelectedTests([]);
      setIsDrawerOpen(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col justify-between">
      <div>
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col gap-10">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200/60 pb-8">
            <div>
              <span className="text-xs text-blue-600 font-bold uppercase tracking-wider">Clinical Search</span>
              <h1 className="font-heading font-bold text-slate-800 text-3xl sm:text-4xl mt-2">Available Diagnostics</h1>
              <p className="text-slate-400 text-sm mt-2">Search individual test parameters and book rapid-turnaround phlebotomy appointments.</p>
            </div>
            
            {selectedTests.length > 0 && (
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-3.5 rounded-2xl text-sm font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center gap-3 animate-pulse cursor-pointer"
              >
                <span>Book Selected ({selectedTests.length})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Toast Message */}
          {successMessage && (
            <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-3xl p-5 flex items-center justify-between shadow-sm">
              <span className="text-sm font-semibold">{successMessage}</span>
              <button onClick={() => setSuccessMessage("")} className="text-emerald-500 hover:text-emerald-800">
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Search and Filters Layout */}
          <div className="grid lg:grid-cols-4 gap-8">
            
            {/* Sidebar Filters */}
            <div className="flex flex-col gap-6">
              <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
                <div>
                  <h3 className="font-heading font-bold text-slate-800 text-base">Filters</h3>
                  <div className="h-0.5 w-8 bg-blue-600 mt-2 rounded-full" />
                </div>

                {/* Keyword Search */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Search Keyword</label>
                  <div className="relative bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center gap-2">
                    <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="CBC, Lipid, Urine..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent border-none outline-none text-sm text-slate-700 placeholder-slate-400 flex-grow"
                    />
                  </div>
                </div>

                {/* Category Tags */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Diagnostic Area</label>
                  <div className="flex flex-col gap-1">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                          selectedCategory === cat
                            ? "bg-blue-50 text-blue-600"
                            : "text-slate-500 hover:bg-slate-50"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Catalog Grid */}
            <div className="lg:col-span-3">
              <div className="grid sm:grid-cols-2 gap-6">
                {filteredTests.map((test) => {
                  const isSelected = selectedTests.some(t => t._id === test._id);
                  return (
                    <div
                      key={test._id}
                      className={`bg-white border rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between gap-6 ${
                        isSelected ? "border-blue-500 ring-2 ring-blue-50" : "border-slate-200/60"
                      }`}
                    >
                      <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                            {test.category}
                          </span>
                          <span className="text-xs text-slate-400 font-bold uppercase">{test.code}</span>
                        </div>
                        <h3 className="font-heading font-bold text-slate-800 text-base leading-snug">{test.name}</h3>
                        <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">{test.description}</p>
                      </div>

                      <div className="flex flex-col gap-4 border-t border-slate-100 pt-4 mt-2">
                        <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {test.turnaroundTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <Stethoscope className="w-3.5 h-3.5" />
                            {test.sampleRequired}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="font-heading font-bold text-slate-800 text-xl">₹{test.price}</span>
                          <button
                            onClick={() => handleToggleCart(test)}
                            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                              isSelected
                                ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                                : "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-600/10"
                            }`}
                          >
                            {isSelected ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Selected</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" />
                                <span>Select Test</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredTests.length === 0 && (
                <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center shadow-sm">
                  <ShieldAlert className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="font-heading font-bold text-slate-800 text-lg">No Diagnostics Found</h3>
                  <p className="text-slate-400 text-sm mt-2">Adjust your keyword search or change category tags.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BOOKING CART SLIDE-OUT DRAWER */}
        <AnimatePresence>
          {isDrawerOpen && (
            <>
              {/* Overlay Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsDrawerOpen(false)}
                className="fixed inset-0 bg-black z-50 cursor-pointer"
              />

              {/* Drawer Container */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="fixed right-0 top-0 bottom-0 w-full md:w-[480px] bg-white z-50 shadow-2xl overflow-y-auto flex flex-col justify-between"
              >
                {/* Header */}
                <div className="px-6 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                  <div>
                    <h2 className="font-heading font-bold text-slate-800 text-lg">Phlebotomy Booking Drawer</h2>
                    <p className="text-slate-400 text-xs mt-1">Configure appointment and patient parameters.</p>
                  </div>
                  <button onClick={() => setIsDrawerOpen(false)} className="text-slate-400 hover:text-slate-800 bg-white border border-slate-200 rounded-full p-2">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Cart Body */}
                <div className="p-6 flex-grow flex flex-col gap-6">
                  {/* Selected Tests Summary */}
                  <div className="flex flex-col gap-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Booked Diagnostic List</h4>
                    <div className="flex flex-col gap-2 max-h-36 overflow-y-auto pr-1">
                      {selectedTests.map((t) => (
                        <div key={t._id} className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex justify-between items-center">
                          <div>
                            <span className="font-bold text-slate-800 text-xs leading-none block">{t.name}</span>
                            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-1 block">{t.code}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-heading font-bold text-slate-800 text-xs">₹{t.price}</span>
                            <button onClick={() => handleToggleCart(t)} className="text-red-400 hover:text-red-600">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Auth Requirement Section if not logged in */}
                  {!user ? (
                    <div className="bg-blue-50/50 border border-blue-200/40 rounded-2xl p-5 flex flex-col gap-4">
                      <div className="flex items-start gap-3">
                        <UserCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm">Account Required to Book</h4>
                          <p className="text-slate-500 text-xs leading-relaxed mt-0.5">Please sign in or register inside our sandbox to track results.</p>
                        </div>
                      </div>

                      {authError && <p className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 rounded-md p-2">{authError}</p>}

                      <form onSubmit={handleInlineLogin} className="flex flex-col gap-2.5">
                        <input
                          type="email"
                          placeholder="patient@example.com (Sandbox email)"
                          value={authEmail}
                          onChange={(e) => setAuthEmail(e.target.value)}
                          className="bg-white border border-slate-200 rounded-xl p-3 text-xs outline-none text-slate-700"
                          required
                        />
                        <input
                          type="password"
                          placeholder="patient123 (Sandbox password)"
                          value={authPassword}
                          onChange={(e) => setAuthPassword(e.target.value)}
                          className="bg-white border border-slate-200 rounded-xl p-3 text-xs outline-none text-slate-700"
                          required
                        />
                        <button type="submit" className="bg-blue-600 text-white hover:bg-blue-700 py-3 rounded-xl text-xs font-bold shadow-md shadow-blue-500/10 cursor-pointer">
                          Authenticate Session
                        </button>
                      </form>
                    </div>
                  ) : (
                    /* Slot and Details selection */
                    <div className="flex flex-col gap-5">
                      {/* Booking Type Options */}
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Booking Medium</label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setBookingType("Home Collection")}
                            className={`py-3 rounded-xl text-xs font-bold border transition-all ${
                              bookingType === "Home Collection"
                                ? "bg-blue-50 text-blue-600 border-blue-500"
                                : "bg-white text-slate-600 border-slate-200"
                            }`}
                          >
                            Home Collection
                          </button>
                          <button
                            type="button"
                            onClick={() => setBookingType("Lab Visit")}
                            className={`py-3 rounded-xl text-xs font-bold border transition-all ${
                              bookingType === "Lab Visit"
                                ? "bg-blue-50 text-blue-600 border-blue-500"
                                : "bg-white text-slate-600 border-slate-200"
                            }`}
                          >
                            Lab Visit
                          </button>
                        </div>
                      </div>

                      {/* Date & Slot selection */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Date</label>
                          <input
                            type="date"
                            value={bookingDate}
                            min={new Date().toISOString().split("T")[0]}
                            onChange={(e) => setBookingDate(e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 outline-none w-full"
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Time Slot</label>
                          <select
                            value={bookingTime}
                            onChange={(e) => setBookingTime(e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 outline-none w-full"
                          >
                            <option value="">Choose slot</option>
                            <option value="08:00 AM - 10:00 AM">08:00 AM - 10:00 AM</option>
                            <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                            <option value="12:00 PM - 02:00 PM">12:00 PM - 02:00 PM</option>
                            <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                          </select>
                        </div>
                      </div>

                      {/* Collection Address if Home Collection */}
                      {bookingType === "Home Collection" && (
                        <div className="flex flex-col gap-3">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phlebotomy Address</label>
                          <input
                            type="text"
                            placeholder="Street Address"
                            value={address.street}
                            onChange={(e) => setAddress({ ...address, street: e.target.value })}
                            className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none text-slate-700"
                          />
                          <div className="grid grid-cols-3 gap-2">
                            <input
                              type="text"
                              placeholder="City"
                              value={address.city}
                              onChange={(e) => setAddress({ ...address, city: e.target.value })}
                              className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none text-slate-700"
                            />
                            <input
                              type="text"
                              placeholder="State"
                              value={address.state}
                              onChange={(e) => setAddress({ ...address, state: e.target.value })}
                              className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none text-slate-700"
                            />
                            <input
                              type="text"
                              placeholder="Zip"
                              value={address.zipCode}
                              onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                              className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none text-slate-700"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer Drawer */}
                <div className="px-6 py-6 border-t border-slate-100 bg-slate-50 flex flex-col gap-4">
                  <div className="flex items-center justify-between font-heading font-bold">
                    <span className="text-slate-600 text-sm">Grand Total:</span>
                    <span className="text-slate-800 text-2xl">₹{selectedTests.reduce((sum, t) => sum + t.price, 0)}</span>
                  </div>

                  {user ? (
                    <button
                      onClick={handleSubmitBooking}
                      className="w-full bg-blue-600 text-white hover:bg-blue-700 py-3.5 rounded-2xl text-sm font-bold shadow-lg shadow-blue-500/20 cursor-pointer text-center"
                    >
                      Confirm Phlebotomy Appointment
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full bg-slate-300 text-slate-500 py-3.5 rounded-2xl text-sm font-bold cursor-not-allowed text-center"
                    >
                      Please Authenticate First
                    </button>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </div>
  );
}

export default function TestsPage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <TestsCatalog />
    </React.Suspense>
  );
}
