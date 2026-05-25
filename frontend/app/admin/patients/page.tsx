"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  QrCode,
  FileText,
  Download,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Activity,
  ChevronRight,
  RefreshCw
} from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardSidebar from "@/components/DashboardSidebar";
import API from "@/services/api";

interface Patient {
  _id: string;
  patientId: string;
  fullName: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  address: string;
  bloodGroup: string;
  testType: string;
  doctorName: string;
  dateOfRegistration: string;
  paymentStatus: "Pending" | "Paid";
  transactionId?: string;
  reportStatus: "Pending" | "Ready";
  reportPath?: string;
}

interface TestItem {
  _id: string;
  name: string;
}

export default function PatientsManager() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [tests, setTests] = useState<TestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [reportLoadingId, setReportLoadingId] = useState<string | null>(null);
  
  // Search & Filter state
  const [search, setSearch] = useState("");
  const [filterPayment, setFilterPayment] = useState("");
  const [filterReport, setFilterReport] = useState("");
  const [filterTest, setFilterTest] = useState("");

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Active records for modals
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Form states
  const [form, setForm] = useState({
    fullName: "",
    age: "",
    gender: "Male",
    phone: "",
    email: "",
    address: "",
    bloodGroup: "A+",
    testType: "",
    doctorName: "",
    dateOfRegistration: new Date().toISOString().split("T")[0],
  });

  const [paymentForm, setPaymentForm] = useState({
    transactionId: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Fetch patients
  const fetchPatients = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (filterPayment) params.append("paymentStatus", filterPayment);
      if (filterReport) params.append("reportStatus", filterReport);
      if (filterTest) params.append("testType", filterTest);

      const res = await API.get(`/patients?${params.toString()}`);
      if (res.data.status === "success") {
        setPatients(res.data.data);
      }
    } catch (err: any) {
      showToast("error", err.response?.data?.message || "Failed to fetch patients database.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch tests to populate dropdowns
  const fetchTests = async () => {
    try {
      const res = await API.get("/tests");
      if (res.data.status === "success") {
        setTests(res.data.data);
        if (res.data.data.length > 0 && !form.testType) {
          setForm(prev => ({ ...prev, testType: res.data.data[0].name }));
        }
      }
    } catch (err) {
      console.warn("Failed to load active tests from server, falling back to static options.");
    }
  };

  useEffect(() => {
    fetchPatients();
    fetchTests();
  }, [filterPayment, filterReport, filterTest]);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!form.age || Number(form.age) <= 0) newErrors.age = "Please enter a valid age";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.doctorName.trim()) newErrors.doctorName = "Doctor name is required";
    if (!form.testType) newErrors.testType = "Please select a test";
    
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast("error", "Please correct validation errors before submitting.");
      return;
    }

    try {
      const payload = {
        ...form,
        age: Number(form.age),
      };
      const res = await API.post("/patients", payload);
      if (res.data.status === "success") {
        showToast("success", `Patient ${res.data.data.fullName} registered successfully!`);
        setIsAddModalOpen(false);
        resetForm();
        fetchPatients();
      }
    } catch (err: any) {
      showToast("error", err.response?.data?.message || "Failed to add patient.");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !selectedPatient) {
      showToast("error", "Please correct validation errors before submitting.");
      return;
    }

    try {
      const payload = {
        ...form,
        age: Number(form.age),
      };
      const res = await API.put(`/patients/${selectedPatient._id}`, payload);
      if (res.data.status === "success") {
        showToast("success", `Patient record updated successfully.`);
        setIsEditModalOpen(false);
        resetForm();
        fetchPatients();
      }
    } catch (err: any) {
      showToast("error", err.response?.data?.message || "Failed to update patient.");
    }
  };

  const handleDelete = async (patient: Patient) => {
    if (!confirm(`Are you sure you want to delete patient ${patient.fullName}?`)) {
      return;
    }

    try {
      const res = await API.delete(`/patients/${patient._id}`);
      if (res.data.status === "success") {
        showToast("success", "Patient record deleted successfully.");
        fetchPatients();
      }
    } catch (err: any) {
      showToast("error", err.response?.data?.message || "Failed to delete patient.");
    }
  };

  const handleGenerateReport = async (patient: Patient) => {
    setReportLoadingId(patient._id);
    try {
      const res = await API.post(`/patients/${patient._id}/generate-report`);
      if (res.data.status === "success") {
        showToast("success", `Report for ${patient.fullName} certified and generated locally!`);
        fetchPatients();
      }
    } catch (err: any) {
      showToast("error", err.response?.data?.message || "Failed to generate PDF report.");
    } finally {
      setReportLoadingId(null);
    }
  };

  const handleDownloadReport = (patient: Patient) => {
    if (!patient.reportPath) return;
    const backendUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace("/api", "");
    window.open(`${backendUrl}${patient.reportPath}`, "_blank");
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    try {
      const res = await API.post(`/patients/${selectedPatient._id}/payment`, {
        transactionId: paymentForm.transactionId,
      });
      if (res.data.status === "success") {
        showToast("success", "Payment status updated to PAID successfully!");
        setIsPaymentModalOpen(false);
        setPaymentForm({ transactionId: "" });
        fetchPatients();
      }
    } catch (err: any) {
      showToast("error", err.response?.data?.message || "Failed to process payment status.");
    }
  };

  const openAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const openEditModal = (patient: Patient) => {
    setSelectedPatient(patient);
    setForm({
      fullName: patient.fullName,
      age: String(patient.age),
      gender: patient.gender,
      phone: patient.phone,
      email: patient.email || "",
      address: patient.address,
      bloodGroup: patient.bloodGroup,
      testType: patient.testType,
      doctorName: patient.doctorName,
      dateOfRegistration: new Date(patient.dateOfRegistration).toISOString().split("T")[0],
    });
    setIsEditModalOpen(true);
  };

  const openPaymentModal = (patient: Patient) => {
    setSelectedPatient(patient);
    setPaymentForm({ transactionId: patient.transactionId || "" });
    setIsPaymentModalOpen(true);
  };

  const resetForm = () => {
    setForm({
      fullName: "",
      age: "",
      gender: "Male",
      phone: "",
      email: "",
      address: "",
      bloodGroup: "A+",
      testType: tests.length > 0 ? tests[0].name : "Complete Blood Count",
      doctorName: "",
      dateOfRegistration: new Date().toISOString().split("T")[0],
    });
    setErrors({});
    setSelectedPatient(null);
  };

  // Helper for status badge styles
  const getPaymentBadge = (status: string) => {
    return status === "Paid"
      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
      : "bg-amber-50 text-amber-700 border border-amber-200";
  };

  const getReportBadge = (status: string) => {
    return status === "Ready"
      ? "bg-blue-50 text-blue-700 border border-blue-200"
      : "bg-slate-100 text-slate-500 border border-slate-200";
  };

  const staticTests = [
    "Complete Blood Count",
    "Blood Sugar Test",
    "Lipid Profile",
    "Thyroid Profile (T3, T4, TSH)",
    "Liver Function Test",
    "Kidney Function Test",
    "Urine Routine Analysis"
  ];

  const testList = tests.length > 0 ? tests.map(t => t.name) : staticTests;

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar */}
        <DashboardSidebar isAdmin={true} />

        {/* Main Content */}
        <main className="flex-grow flex flex-col gap-6 overflow-hidden">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/60 pb-5 gap-4">
            <div>
              <h1 className="font-heading font-bold text-slate-800 text-2xl">Patients Manager</h1>
              <p className="text-slate-400 text-xs mt-1">Register new clinical profiles, track test bills, and generate certified PDF reports.</p>
            </div>
            
            <button
              onClick={openAddModal}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl text-xs font-bold transition-all shadow-md shadow-blue-500/10 cursor-pointer flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Patient</span>
            </button>
          </div>

          {/* Toast Notification */}
          {toast && (
            <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-lg border transition-all ${
              toast.type === "success" 
                ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                : "bg-rose-50 text-rose-800 border-rose-200"
            }`}>
              {toast.type === "success" ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-rose-600" />}
              <span className="text-xs font-semibold">{toast.message}</span>
            </div>
          )}

          {/* Search and Filters */}
          <div className="bg-white border border-slate-200/50 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-center gap-4">
            
            {/* Search Input */}
            <div className="relative w-full sm:flex-grow">
              <Search className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search patient ID, name, doctor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-slate-50 border border-slate-200/60 rounded-xl pl-10 pr-4 py-3 text-xs w-full outline-none font-semibold text-slate-700 focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>

            {/* Filter controls */}
            <div className="grid grid-cols-3 gap-2 w-full sm:w-auto shrink-0">
              <select
                value={filterPayment}
                onChange={(e) => setFilterPayment(e.target.value)}
                className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 text-xs text-slate-600 font-bold outline-none cursor-pointer"
              >
                <option value="">Payment Status</option>
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
              </select>

              <select
                value={filterReport}
                onChange={(e) => setFilterReport(e.target.value)}
                className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 text-xs text-slate-600 font-bold outline-none cursor-pointer"
              >
                <option value="">Report Status</option>
                <option value="Pending">Pending</option>
                <option value="Ready">Ready</option>
              </select>

              <button
                onClick={fetchPatients}
                className="bg-slate-100 hover:bg-slate-200 border border-slate-200/60 text-slate-600 font-bold text-xs p-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Refresh</span>
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-sm flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-semibold text-slate-700 border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 pb-3 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                    <th className="py-4 px-3">Patient ID</th>
                    <th className="py-4 px-3">Full Name</th>
                    <th className="py-4 px-3">Age / Gender</th>
                    <th className="py-4 px-3">Selected Test</th>
                    <th className="py-4 px-3">Doctor</th>
                    <th className="py-4 px-3">Reg Date</th>
                    <th className="py-4 px-3">Payment</th>
                    <th className="py-4 px-3">Report</th>
                    <th className="py-4 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={9} className="py-10 text-center">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                          <span className="text-xs text-slate-400 font-bold">Querying local diagnostics database...</span>
                        </div>
                      </td>
                    </tr>
                  ) : patients.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-10 text-center text-slate-400 font-bold">
                        No patient records found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    patients.map((patient) => (
                      <tr key={patient._id} className="border-b border-slate-50/50 hover:bg-slate-50/40 transition-colors">
                        <td className="py-4 px-3 font-bold text-slate-800">{patient.patientId}</td>
                        <td className="py-4 px-3">
                          <div>
                            <p className="font-bold text-slate-800">{patient.fullName}</p>
                            <p className="text-[10px] text-slate-400 font-medium mt-0.5">{patient.phone}</p>
                          </div>
                        </td>
                        <td className="py-4 px-3 text-slate-500 font-medium">{patient.age} Yrs / {patient.gender}</td>
                        <td className="py-4 px-3 text-blue-600 font-bold truncate max-w-[120px]">{patient.testType}</td>
                        <td className="py-4 px-3 text-slate-600 font-medium">Dr. {patient.doctorName}</td>
                        <td className="py-4 px-3 text-slate-500 font-medium">{new Date(patient.dateOfRegistration).toLocaleDateString()}</td>
                        <td className="py-4 px-3">
                          <button
                            onClick={() => openPaymentModal(patient)}
                            className={`px-2.5 py-1 rounded-full text-[9px] font-bold cursor-pointer transition-all ${getPaymentBadge(patient.paymentStatus)}`}
                          >
                            {patient.paymentStatus}
                          </button>
                        </td>
                        <td className="py-4 px-3">
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold ${getReportBadge(patient.reportStatus)}`}>
                            {patient.reportStatus}
                          </span>
                        </td>
                        <td className="py-4 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            
                            {/* Report Generation Actions */}
                            {patient.reportStatus === "Pending" ? (
                              <button
                                onClick={() => handleGenerateReport(patient)}
                                disabled={reportLoadingId === patient._id}
                                title="Generate PDF Report"
                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl cursor-pointer transition-all disabled:opacity-40"
                              >
                                {reportLoadingId === patient._id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <FileText className="w-4 h-4" />
                                )}
                              </button>
                            ) : (
                              <button
                                onClick={() => handleDownloadReport(patient)}
                                title="Download Report PDF"
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl cursor-pointer transition-all"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            )}

                            {/* Edit Action */}
                            <button
                              onClick={() => openEditModal(patient)}
                              title="Edit Patient Details"
                              className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl cursor-pointer transition-all"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            {/* Delete Action */}
                            <button
                              onClick={() => handleDelete(patient)}
                              title="Delete Patient Record"
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl cursor-pointer transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add / Edit Patient Modal */}
          {(isAddModalOpen || isEditModalOpen) && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
              <div className="bg-white border border-slate-200 rounded-[24px] shadow-2xl p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col gap-6 relative animate-in fade-in zoom-in-95 duration-200">
                
                {/* Close Button */}
                <button
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  className="absolute right-6 top-6 text-slate-400 hover:text-slate-600 hover:bg-slate-50 p-2 rounded-xl transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Heading */}
                <div>
                  <h3 className="font-heading font-bold text-slate-800 text-lg">
                    {isAddModalOpen ? "Register New Patient" : "Edit Patient Profile"}
                  </h3>
                  <p className="text-slate-400 text-xs mt-1">Please populate all required parameters. Valid NABL formatting is checked.</p>
                </div>

                <form onSubmit={isAddModalOpen ? handleAddSubmit : handleEditSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Full Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Patient Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Kumar"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      className={`bg-slate-50 border rounded-xl p-3 text-xs w-full outline-none font-semibold text-slate-700 focus:border-blue-500 focus:bg-white transition-all ${
                        errors.fullName ? "border-red-300 focus:border-red-500" : "border-slate-200/80"
                      }`}
                    />
                    {errors.fullName && <span className="text-[9px] text-red-500 font-bold">{errors.fullName}</span>}
                  </div>

                  {/* Age */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Age (Years)</label>
                    <input
                      type="number"
                      placeholder="e.g. 45"
                      value={form.age}
                      onChange={(e) => setForm({ ...form, age: e.target.value })}
                      className={`bg-slate-50 border rounded-xl p-3 text-xs w-full outline-none font-semibold text-slate-700 focus:border-blue-500 focus:bg-white transition-all ${
                        errors.age ? "border-red-300 focus:border-red-500" : "border-slate-200/80"
                      }`}
                    />
                    {errors.age && <span className="text-[9px] text-red-500 font-bold">{errors.age}</span>}
                  </div>

                  {/* Gender */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gender</label>
                    <select
                      value={form.gender}
                      onChange={(e) => setForm({ ...form, gender: e.target.value })}
                      className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs w-full outline-none font-bold text-slate-700 cursor-pointer focus:border-blue-500 focus:bg-white transition-all"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Blood Group */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Blood Group</label>
                    <select
                      value={form.bloodGroup}
                      onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                      className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs w-full outline-none font-bold text-slate-700 cursor-pointer focus:border-blue-500 focus:bg-white transition-all"
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>

                  {/* Phone Number */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone Number</label>
                    <input
                      type="text"
                      placeholder="e.g. 9876543210"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className={`bg-slate-50 border rounded-xl p-3 text-xs w-full outline-none font-semibold text-slate-700 focus:border-blue-500 focus:bg-white transition-all ${
                        errors.phone ? "border-red-300 focus:border-red-500" : "border-slate-200/80"
                      }`}
                    />
                    {errors.phone && <span className="text-[9px] text-red-500 font-bold">{errors.phone}</span>}
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      placeholder="e.g. patient@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className={`bg-slate-50 border rounded-xl p-3 text-xs w-full outline-none font-semibold text-slate-700 focus:border-blue-500 focus:bg-white transition-all ${
                        errors.email ? "border-red-300 focus:border-red-500" : "border-slate-200/80"
                      }`}
                    />
                    {errors.email && <span className="text-[9px] text-red-500 font-bold">{errors.email}</span>}
                  </div>

                  {/* Test Type selection */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Selected Lab Test</label>
                    <select
                      value={form.testType}
                      onChange={(e) => setForm({ ...form, testType: e.target.value })}
                      className={`bg-slate-50 border rounded-xl p-3 text-xs w-full outline-none font-bold text-slate-700 cursor-pointer focus:border-blue-500 focus:bg-white transition-all ${
                        errors.testType ? "border-red-300 focus:border-red-500" : "border-slate-200/80"
                      }`}
                    >
                      <option value="">-- Choose Diagnostic Test --</option>
                      {testList.map((testName, i) => (
                        <option key={i} value={testName}>{testName}</option>
                      ))}
                    </select>
                    {errors.testType && <span className="text-[9px] text-red-500 font-bold">{errors.testType}</span>}
                  </div>

                  {/* Doctor Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ref. Doctor Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Sandeep Raichur"
                      value={form.doctorName}
                      onChange={(e) => setForm({ ...form, doctorName: e.target.value })}
                      className={`bg-slate-50 border rounded-xl p-3 text-xs w-full outline-none font-semibold text-slate-700 focus:border-blue-500 focus:bg-white transition-all ${
                        errors.doctorName ? "border-red-300 focus:border-red-500" : "border-slate-200/80"
                      }`}
                    />
                    {errors.doctorName && <span className="text-[9px] text-red-500 font-bold">{errors.doctorName}</span>}
                  </div>

                  {/* Date of Registration */}
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date of Registration</label>
                    <input
                      type="date"
                      value={form.dateOfRegistration}
                      onChange={(e) => setForm({ ...form, dateOfRegistration: e.target.value })}
                      className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs w-full outline-none font-semibold text-slate-700 focus:border-blue-500 focus:bg-white transition-all"
                    />
                  </div>

                  {/* Address */}
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Residential Address</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Near Bus Stand, Lingasugur Road, Raichur"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      className={`bg-slate-50 border rounded-xl p-3 text-xs w-full outline-none font-semibold text-slate-700 focus:border-blue-500 focus:bg-white transition-all resize-none ${
                        errors.address ? "border-red-300 focus:border-red-500" : "border-slate-200/80"
                      }`}
                    />
                    {errors.address && <span className="text-[9px] text-red-500 font-bold">{errors.address}</span>}
                  </div>

                  {/* Submit buttons */}
                  <div className="flex items-center justify-end gap-2.5 sm:col-span-2 mt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddModalOpen(false);
                        setIsEditModalOpen(false);
                      }}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-5 py-3.5 rounded-2xl text-xs font-bold transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-2xl text-xs font-bold transition-all shadow-md shadow-blue-500/10 cursor-pointer"
                    >
                      {isAddModalOpen ? "Register Patient" : "Update Profile"}
                    </button>
                  </div>

                </form>

              </div>
            </div>
          )}

          {/* Payment Modal with QR Scanner Image */}
          {isPaymentModalOpen && selectedPatient && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
              <div className="bg-white border border-slate-200 rounded-[28px] shadow-2xl p-6 sm:p-8 w-full max-w-md flex flex-col gap-6 relative animate-in fade-in zoom-in-95 duration-200">
                
                {/* Close button */}
                <button
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="absolute right-6 top-6 text-slate-400 hover:text-slate-600 hover:bg-slate-50 p-2 rounded-xl transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="text-center">
                  <h3 className="font-heading font-bold text-slate-800 text-lg">UPI Payment Portal</h3>
                  <p className="text-slate-400 text-xs mt-1">Scan QR via PhonePe or any UPI application to clear the bill.</p>
                </div>

                {/* Patient Summary */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-1.5 text-xs text-slate-600 font-semibold">
                  <div className="flex justify-between">
                    <span>Patient Name:</span>
                    <span className="text-slate-800 font-bold">{selectedPatient.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Patient ID:</span>
                    <span className="text-slate-800 font-bold">{selectedPatient.patientId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Assay Parameter:</span>
                    <span className="text-blue-600 font-bold">{selectedPatient.testType}</span>
                  </div>
                  <div className="h-px bg-slate-200/50 my-1" />
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-bold">Billing Amount:</span>
                    <span className="text-slate-800 font-black">₹499.00</span>
                  </div>
                </div>

                {/* QR Code Container */}
                <div className="flex flex-col items-center justify-center gap-3 py-2">
                  <div className="border border-slate-200 rounded-3xl p-3 bg-white shadow-md relative group overflow-hidden max-w-[200px] aspect-square flex items-center justify-center">
                    {/* PhonePe QR image loaded statically from payments folder */}
                    <img
                      src={`http://localhost:5000/payments/phonepe_qr.png?t=${new Date().getTime()}`}
                      alt="PhonePe UPI QR Scanner"
                      className="w-full h-full object-contain rounded-2xl"
                      onError={(e) => {
                        // Fallback to local default logo or standard placeholder if server down
                        (e.target as HTMLImageElement).src = "https://placehold.co/200x200/2563eb/ffffff?text=Scan+To+Pay";
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-blue-600 bg-blue-50 px-3 py-1 rounded-full font-bold uppercase tracking-wider mt-1">
                    PhonePe Accepted Here
                  </span>
                  <span className="text-[9px] text-slate-400 font-bold">
                    Scan to Pay
                  </span>
                </div>

                {/* Form to submit transaction ID */}
                <form onSubmit={handlePaymentSubmit} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">UPI Transaction ID (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. TXN284920482"
                      value={paymentForm.transactionId}
                      onChange={(e) => setPaymentForm({ transactionId: e.target.value })}
                      className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 text-xs w-full outline-none font-semibold text-slate-700 focus:border-blue-500 focus:bg-white transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-2xl text-xs font-bold transition-all shadow-md shadow-emerald-500/10 cursor-pointer w-full text-center"
                  >
                    Confirm & Record Payment
                  </button>
                </form>

              </div>
            </div>
          )}

        </main>
      </div>
    </ProtectedRoute>
  );
}
