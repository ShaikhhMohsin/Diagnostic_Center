"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Microscope, Stethoscope, Clock, ShieldAlert } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardSidebar from "@/components/DashboardSidebar";
import API from "@/services/api";

const INITIAL_TESTS = [
  { _id: "t1", name: "Complete Blood Count (CBC)", code: "CBC", category: "Blood Test", price: 299, turnaroundTime: "12 Hours", sampleRequired: "Blood", description: "Standard cell metrics profile." },
  { _id: "t2", name: "Lipid Profile (Cholesterol)", code: "LIPID", category: "Heart Health", price: 599, turnaroundTime: "24 Hours", sampleRequired: "Blood", description: "Assesses cardiovascular status." }
];

export default function AdminTests() {
  const [tests, setTests] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTest, setNewTest] = useState({
    name: "",
    code: "",
    category: "Blood Test",
    price: "",
    turnaroundTime: "24 Hours",
    sampleRequired: "Blood",
    description: "",
    preparation: ""
  });

  const fetchTests = async () => {
    try {
      const res = await API.get("/tests");
      if (res.data.status === "success" && res.data.data.length > 0) {
        setTests(res.data.data);
      } else {
        setTests(INITIAL_TESTS);
      }
    } catch (err) {
      console.warn("Could not query live tests, displaying sandbox mock database.");
      setTests(INITIAL_TESTS);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const handleAddTest = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...newTest,
      price: Number(newTest.price) || 0
    };

    try {
      const res = await API.post("/tests", payload);
      if (res.data.status === "success") {
        setTests([...tests, res.data.data]);
        setShowAddForm(false);
        setNewTest({ name: "", code: "", category: "Blood Test", price: "", turnaroundTime: "24 Hours", sampleRequired: "Blood", description: "", preparation: "" });
        alert("New test defined!");
      }
    } catch (err) {
      // Local mockup save
      const mockNew = { ...payload, _id: `mock-t-${Date.now()}` };
      setTests([...tests, mockNew]);
      setShowAddForm(false);
      setNewTest({ name: "", code: "", category: "Blood Test", price: "", turnaroundTime: "24 Hours", sampleRequired: "Blood", description: "", preparation: "" });
      alert("New test defined in Sandbox Mode!");
    }
  };

  const handleDeleteTest = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this test?")) return;

    try {
      const res = await API.delete(`/tests/${id}`);
      if (res.data.status === "success") {
        setTests(tests.filter(t => t._id !== id));
      }
    } catch (err) {
      // Sandbox delete
      setTests(tests.filter(t => t._id !== id));
      alert("Test deleted in Sandbox Mode!");
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
              <h1 className="font-heading font-bold text-slate-800 text-2xl">Diagnostic Registry</h1>
              <p className="text-slate-400 text-xs mt-1">Configure individual assay definitions, prices, and turnaround slots.</p>
            </div>
            
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3.5 rounded-2xl text-xs font-bold transition-all shadow-md shadow-blue-500/10 flex items-center gap-2 cursor-pointer w-fit"
            >
              <Plus className="w-4 h-4" />
              <span>Define New Test</span>
            </button>
          </div>

          {/* Add Form Panel */}
          {showAddForm && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md">
              <form onSubmit={handleAddTest} className="flex flex-col gap-4 max-w-xl">
                <h3 className="font-heading font-bold text-slate-800 text-sm">Define New Laboratory Parameter</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Test Name</label>
                    <input
                      type="text"
                      required
                      value={newTest.name}
                      onChange={(e) => setNewTest({ ...newTest, name: e.target.value })}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none text-slate-700"
                      placeholder="e.g. Vitamin D3"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Unique Code</label>
                    <input
                      type="text"
                      required
                      value={newTest.code}
                      onChange={(e) => setNewTest({ ...newTest, code: e.target.value })}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none text-slate-700"
                      placeholder="e.g. VITD"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</label>
                    <input
                      type="text"
                      required
                      value={newTest.category}
                      onChange={(e) => setNewTest({ ...newTest, category: e.target.value })}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none text-slate-700"
                      placeholder="e.g. Vitamin Assays"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cost (₹)</label>
                    <input
                      type="number"
                      required
                      value={newTest.price}
                      onChange={(e) => setNewTest({ ...newTest, price: e.target.value })}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none text-slate-700"
                      placeholder="e.g. 299"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Turnaround Time</label>
                    <input
                      type="text"
                      required
                      value={newTest.turnaroundTime}
                      onChange={(e) => setNewTest({ ...newTest, turnaroundTime: e.target.value })}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none text-slate-700"
                      placeholder="e.g. 24 Hours"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sample Medium</label>
                    <input
                      type="text"
                      required
                      value={newTest.sampleRequired}
                      onChange={(e) => setNewTest({ ...newTest, sampleRequired: e.target.value })}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none text-slate-700"
                      placeholder="e.g. Blood"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Clinical Description</label>
                  <textarea
                    rows={2}
                    value={newTest.description}
                    onChange={(e) => setNewTest({ ...newTest, description: e.target.value })}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none text-slate-700 resize-none"
                    placeholder="Describe clinical importance..."
                  />
                </div>

                <button
                  type="submit"
                  className="bg-blue-600 text-white py-3.5 rounded-2xl text-xs font-bold transition-all shadow-md shadow-blue-500/10 cursor-pointer text-center w-full"
                >
                  Save Parameter
                </button>
              </form>
            </div>
          )}

          {/* List Layout */}
          <div className="grid sm:grid-cols-2 gap-6">
            {tests.map((test) => (
              <div key={test._id} className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm flex flex-col justify-between gap-6 hover:shadow-md transition-all">
                <div>
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                      {test.category}
                    </span>
                    <span className="text-xs text-slate-400 font-bold uppercase">{test.code}</span>
                  </div>
                  <h3 className="font-heading font-bold text-slate-800 text-base mt-4 line-clamp-1">{test.name}</h3>
                  <p className="text-slate-400 text-xs mt-2 leading-relaxed line-clamp-2">{test.description}</p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Cost</span>
                    <span className="font-heading font-bold text-slate-800 text-lg">₹{test.price}</span>
                  </div>
                  
                  <button
                    onClick={() => handleDeleteTest(test._id)}
                    className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white p-2.5 rounded-xl transition-all cursor-pointer border border-red-200/10"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </main>
      </div>
    </ProtectedRoute>
  );
}
