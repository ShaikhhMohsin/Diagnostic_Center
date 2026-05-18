"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Layers, CheckCircle, Award } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardSidebar from "@/components/DashboardSidebar";
import API from "@/services/api";

const INITIAL_PACKAGES = [
  {
    _id: "p1",
    name: "Premium Full Body Health Checkup",
    code: "FHC",
    price: 1999,
    discountPrice: 1299,
    description: "Our complete baseline assessment tracking vital blood, heart, and metabolic indicators.",
    tests: ["CBC", "Lipid Profile"],
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop"
  }
];

export default function AdminPackages() {
  const [packages, setPackages] = useState<any[]>([]);
  const [availableTests, setAvailableTests] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [newPkg, setNewPkg] = useState({
    name: "",
    code: "",
    price: "",
    discountPrice: "",
    description: "",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop",
    tests: [] as string[]
  });

  const fetchData = async () => {
    try {
      const pkgRes = await API.get("/packages");
      if (pkgRes.data.status === "success" && pkgRes.data.data.length > 0) {
        setPackages(pkgRes.data.data);
      } else {
        setPackages(INITIAL_PACKAGES);
      }
    } catch (err) {
      setPackages(INITIAL_PACKAGES);
    }

    try {
      const testRes = await API.get("/tests");
      if (testRes.data.status === "success") {
        setAvailableTests(testRes.data.data);
      }
    } catch (err) {
      setAvailableTests([{ _id: "t1", name: "Complete Blood Count" }, { _id: "t2", name: "Lipid Profile" }]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddPkg = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...newPkg,
      price: Number(newPkg.price) || 0,
      discountPrice: Number(newPkg.discountPrice) || undefined
    };

    try {
      const res = await API.post("/packages", payload);
      if (res.data.status === "success") {
        setPackages([...packages, res.data.data]);
        setShowAddForm(false);
        setNewPkg({ name: "", code: "", price: "", discountPrice: "", description: "", image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop", tests: [] });
        alert("New wellness package defined!");
      }
    } catch (err) {
      // Local mockup save
      const mockNew = { ...payload, _id: `mock-p-${Date.now()}` };
      setPackages([...packages, mockNew]);
      setShowAddForm(false);
      setNewPkg({ name: "", code: "", price: "", discountPrice: "", description: "", image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop", tests: [] });
      alert("New package defined in Sandbox Mode!");
    }
  };

  const handleToggleTestCheckbox = (testIdOrCode: string) => {
    if (newPkg.tests.includes(testIdOrCode)) {
      setNewPkg({ ...newPkg, tests: newPkg.tests.filter(t => t !== testIdOrCode) });
    } else {
      setNewPkg({ ...newPkg, tests: [...newPkg.tests, testIdOrCode] });
    }
  };

  const handleDeletePkg = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this package?")) return;

    try {
      const res = await API.delete(`/packages/${id}`);
      if (res.data.status === "success") {
        setPackages(packages.filter(p => p._id !== id));
      }
    } catch (err) {
      // Sandbox delete
      setPackages(packages.filter(p => p._id !== id));
      alert("Package deleted in Sandbox Mode!");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar */}
        <DashboardSidebar isAdmin={true} />

        {/* Core Content */}
        <main className="flex-grow flex flex-col gap-8 overflow-hidden">
          
          <div className="border-b border-slate-200/60 pb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h1 className="font-heading font-bold text-slate-800 text-2xl">Packages Ledger</h1>
              <p className="text-slate-400 text-xs mt-1">Configure diagnostic bundle discounts and link constituent parameters.</p>
            </div>
            
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3.5 rounded-2xl text-xs font-bold transition-all shadow-md shadow-blue-500/10 flex items-center gap-2 cursor-pointer w-fit"
            >
              <Plus className="w-4 h-4" />
              <span>Define New Package</span>
            </button>
          </div>

          {/* Add Form Panel */}
          {showAddForm && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md">
              <form onSubmit={handleAddPkg} className="flex flex-col gap-4 max-w-xl">
                <h3 className="font-heading font-bold text-slate-800 text-sm">Define Wellness Diagnostic Package</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Package Name</label>
                    <input
                      type="text"
                      required
                      value={newPkg.name}
                      onChange={(e) => setNewPkg({ ...newPkg, name: e.target.value })}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none text-slate-700 font-semibold"
                      placeholder="e.g. Executive Full Body Checkup"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Unique Code</label>
                    <input
                      type="text"
                      required
                      value={newPkg.code}
                      onChange={(e) => setNewPkg({ ...newPkg, code: e.target.value })}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none text-slate-700 font-semibold"
                      placeholder="e.g. EXFBC"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Baseline Cost (₹)</label>
                    <input
                      type="number"
                      required
                      value={newPkg.price}
                      onChange={(e) => setNewPkg({ ...newPkg, price: e.target.value })}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none text-slate-700 font-semibold"
                      placeholder="e.g. 1999"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bundle Discount Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={newPkg.discountPrice}
                      onChange={(e) => setNewPkg({ ...newPkg, discountPrice: e.target.value })}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none text-slate-700 font-semibold"
                      placeholder="e.g. 1299"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Constituent Tests Checklist</label>
                  <div className="flex flex-wrap gap-2.5 max-h-32 overflow-y-auto pr-1">
                    {availableTests.map((t) => (
                      <button
                        type="button"
                        key={t._id}
                        onClick={() => handleToggleTestCheckbox(t._id)}
                        className={`px-3 py-2 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                          newPkg.tests.includes(t._id)
                            ? "bg-blue-50 text-blue-600 border-blue-500"
                            : "bg-slate-50 text-slate-500 border-slate-200"
                        }`}
                      >
                        {t.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Clinical Description</label>
                  <textarea
                    rows={2}
                    value={newPkg.description}
                    onChange={(e) => setNewPkg({ ...newPkg, description: e.target.value })}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none text-slate-700 resize-none font-semibold"
                    placeholder="Describe clinical packages coverage..."
                  />
                </div>

                <button
                  type="submit"
                  className="bg-blue-600 text-white py-3.5 rounded-2xl text-xs font-bold transition-all shadow-md shadow-blue-500/10 cursor-pointer text-center w-full"
                >
                  Save Package Definition
                </button>
              </form>
            </div>
          )}

          {/* List layout */}
          <div className="grid sm:grid-cols-2 gap-8">
            {packages.map((pkg) => (
              <div key={pkg._id} className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                <div className="relative h-44 w-full">
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent" />
                  <div className="absolute bottom-5 left-5">
                    <span className="bg-blue-600 text-white font-bold text-[8px] px-2 py-0.5 rounded-md uppercase tracking-wider">
                      {pkg.code}
                    </span>
                    <h3 className="font-heading font-bold text-white text-base mt-1.5">{pkg.name}</h3>
                  </div>
                </div>

                <div className="p-5 flex flex-col gap-5 flex-grow justify-between">
                  <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">{pkg.description}</p>
                  
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
                    <div>
                      <span className="text-[10px] text-slate-400 line-through block font-bold">₹{pkg.price}</span>
                      <span className="font-heading font-bold text-slate-800 text-lg mt-0.5">₹{pkg.discountPrice || pkg.price}</span>
                    </div>

                    <button
                      onClick={() => handleDeletePkg(pkg._id)}
                      className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white p-2.5 rounded-xl transition-all cursor-pointer border border-red-200/10"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </main>
      </div>
    </ProtectedRoute>
  );
}
