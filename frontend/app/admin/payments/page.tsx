"use client";

import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Upload,
  Search,
  Calendar,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileSpreadsheet,
  QrCode,
  Image as ImageIcon,
  RefreshCw,
  Check,
  X
} from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardSidebar from "@/components/DashboardSidebar";
import API from "@/services/api";

interface PaymentLog {
  _id: string;
  amount: number;
  status: "Pending" | "Paid" | "Failed";
  transactionId?: string;
  createdAt: string;
  appointment?: {
    _id: string;
    type: string;
    patient?: {
      name: string;
      email: string;
      contactNumber: string;
    };
    tests?: { name: string }[];
    packages?: { name: string }[];
  };
}

export default function PaymentsLedger() {
  const [logs, setLogs] = useState<PaymentLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [qrTimestamp, setQrTimestamp] = useState<number>(Date.now());
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Fetch Payment Logs
  const fetchPaymentLogs = async () => {
    setLoading(true);
    try {
      const res = await API.get("/payments/history/all");
      if (res.data.status === "success") {
        setLogs(res.data.data);
      }
    } catch (err: any) {
      showToast("error", err.response?.data?.message || "Failed to load payment history logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentLogs();
  }, []);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Handle QR Code image change
  const handleQRUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate is image
    if (!file.type.startsWith("image/")) {
      showToast("error", "Please select a valid image file (PNG/JPG/JPEG).");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("qrImage", file);

    try {
      const res = await API.post("/patients/payments/upload-qr", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.data.status === "success") {
        showToast("success", "PhonePe QR scanner image updated successfully!");
        setQrTimestamp(Date.now()); // refresh image preview to bypass cache
      }
    } catch (err: any) {
      showToast("error", err.response?.data?.message || "Failed to upload QR scanner image.");
    } finally {
      setUploading(false);
    }
  };

  // Handle Manual Verification
  const handleVerify = async (id: string, status: "Paid" | "Failed") => {
    try {
      const res = await API.put(`/payments/${id}/verify`, { status });
      if (res.data.status === "success") {
        showToast("success", `Transaction updated to ${status} successfully!`);
        fetchPaymentLogs();
      }
    } catch (err: any) {
      showToast("error", err.response?.data?.message || "Failed to update transaction status.");
    }
  };

  const filteredLogs = logs.filter((log) => {
    const term = search.toLowerCase();
    const patientName = log.appointment?.patient?.name?.toLowerCase() || "";
    const contact = log.appointment?.patient?.contactNumber || "";
    const txnId = log.transactionId?.toLowerCase() || "";
    
    // Aggregate all test/package names
    const tests = log.appointment?.tests?.map(t => t.name.toLowerCase()).join(" ") || "";
    const packages = log.appointment?.packages?.map(p => p.name.toLowerCase()).join(" ") || "";

    return (
      patientName.includes(term) ||
      contact.includes(term) ||
      txnId.includes(term) ||
      tests.includes(term) ||
      packages.includes(term)
    );
  });

  const backendUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace("/api", "");

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
              <h1 className="font-heading font-bold text-slate-800 text-2xl">Payments Ledger</h1>
              <p className="text-slate-400 text-xs mt-1">Audit administrative transaction histories and modify the active PhonePe scanner configuration.</p>
            </div>
            
            <button
              onClick={fetchPaymentLogs}
              className="bg-slate-100 hover:bg-slate-200 border border-slate-200/60 text-slate-600 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Ledger</span>
            </button>
          </div>

          {/* Toast Alert */}
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

          {/* Top Panel Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* QR Scanner Settings Card */}
            <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-sm flex flex-col gap-5 md:col-span-1">
              <div>
                <h3 className="font-heading font-bold text-slate-800 text-sm">Active PhonePe QR Scanner</h3>
                <div className="h-0.5 w-6 bg-blue-600 mt-1.5 rounded-full" />
              </div>

              {/* QR Preview */}
              <div className="flex flex-col items-center justify-center gap-3 py-2 bg-slate-50 border border-slate-100 rounded-2xl p-4">
                <div className="border border-slate-200 rounded-2xl p-2 bg-white shadow-sm max-w-[130px] aspect-square flex items-center justify-center relative overflow-hidden">
                  <img
                    src={`${backendUrl}/payments/phonepe_qr.png?t=${qrTimestamp}`}
                    alt="Active PhonePe QR"
                    className="w-full h-full object-contain rounded-xl"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/130x130/2563eb/ffffff?text=Scan+To+Pay";
                    }}
                  />
                </div>
                <span className="text-[9px] text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  PhonePe Accepted Here
                </span>
              </div>

              {/* Upload Action */}
              <div className="flex flex-col gap-2">
                <label className="bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 hover:border-blue-300 py-3 rounded-xl text-xs font-bold text-center cursor-pointer transition-all flex items-center justify-center gap-2">
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Uploading Scanner...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Change QR Image</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleQRUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
                <p className="text-[10px] text-slate-400 font-semibold text-center leading-relaxed">
                  Only PNG, JPG or JPEG files are allowed. This file replaces the global PhonePe QR poster.
                </p>
              </div>

            </div>

            {/* Financial Ledger Audit Logs */}
            <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-sm flex flex-col gap-5 md:col-span-2">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-heading font-bold text-slate-800 text-sm">Audited Transactions</h3>
                  <div className="h-0.5 w-6 bg-blue-600 mt-1.5 rounded-full" />
                </div>
                
                {/* Search Log */}
                <div className="relative w-48 sm:w-60">
                  <Search className="absolute left-2.5 top-2.5 text-slate-400 w-3.5 h-3.5" />
                  <input
                    type="text"
                    placeholder="Search logs..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-slate-50 border border-slate-200/60 rounded-lg pl-8 pr-3 py-2 text-[10px] w-full outline-none font-semibold text-slate-700 focus:border-blue-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Transactions Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-semibold text-slate-700 border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 pb-2.5 text-slate-400 uppercase font-bold text-[9px] tracking-wider">
                      <th className="py-3 px-2">Patient</th>
                      <th className="py-3 px-2">Assays / Bundles</th>
                      <th className="py-3 px-2">Transaction ID</th>
                      <th className="py-3 px-2">Amount</th>
                      <th className="py-3 px-2">Status</th>
                      <th className="py-3 px-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center">
                          <Loader2 className="w-6 h-6 text-blue-600 animate-spin mx-auto mb-2" />
                          <span className="text-slate-400 text-[10px] font-bold">Auditing local transaction ledgers...</span>
                        </td>
                      </tr>
                    ) : filteredLogs.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400 font-bold text-[10px]">
                          No logged transactions found.
                        </td>
                      </tr>
                    ) : (
                      filteredLogs.map((log) => {
                        const patientName = log.appointment?.patient?.name || "Deleted User";
                        const phone = log.appointment?.patient?.contactNumber || "N/A";
                        
                        // Combine tests and packages names
                        const testNames = log.appointment?.tests?.map(t => t.name) || [];
                        const pkgNames = log.appointment?.packages?.map(p => p.name) || [];
                        const displayAssays = [...testNames, ...pkgNames].join(", ") || "No tests selected";

                        return (
                          <tr key={log._id} className="border-b border-slate-50/50 hover:bg-slate-50/30 transition-colors">
                            <td className="py-3 px-2">
                              <div>
                                <p className="font-bold text-slate-800">{patientName}</p>
                                <p className="text-[9px] text-slate-400 font-semibold mt-0.5">{phone}</p>
                              </div>
                            </td>
                            <td className="py-3 px-2 text-slate-500 font-medium truncate max-w-[150px]" title={displayAssays}>
                              {displayAssays}
                            </td>
                            <td className="py-3 px-2 font-mono text-[10px] text-slate-800 font-bold">
                              {log.transactionId || <span className="text-amber-500 italic font-sans font-medium text-[9px]">Not Submitted</span>}
                            </td>
                            <td className="py-3 px-2 text-slate-800 font-bold">₹{log.amount}</td>
                            <td className="py-3 px-2">
                              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                log.status === "Paid"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : log.status === "Failed"
                                  ? "bg-rose-50 text-rose-700"
                                  : "bg-amber-50 text-amber-700"
                              }`}>
                                {log.status}
                              </span>
                            </td>
                            <td className="py-3 px-2 text-right">
                              {log.status !== "Paid" && log.transactionId && (
                                <div className="flex justify-end gap-1.5">
                                  <button
                                    onClick={() => handleVerify(log._id, "Paid")}
                                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-600 p-1.5 rounded-lg border border-emerald-200 transition-all cursor-pointer"
                                    title="Verify & Mark Paid"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleVerify(log._id, "Failed")}
                                    className="bg-rose-50 hover:bg-rose-100 text-rose-600 p-1.5 rounded-lg border border-rose-200 transition-all cursor-pointer"
                                    title="Mark Failed"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                              {log.status === "Paid" && (
                                <span className="text-[10px] text-slate-400 font-semibold italic flex items-center justify-end gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                  Verified
                                </span>
                              )}
                              {!log.transactionId && log.status !== "Paid" && (
                                <span className="text-[10px] text-slate-400 font-semibold italic">
                                  Awaiting Payment
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </main>
      </div>
    </ProtectedRoute>
  );
}
