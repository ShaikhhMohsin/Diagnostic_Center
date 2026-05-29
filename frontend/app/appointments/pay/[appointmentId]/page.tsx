"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { QrCode, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import API from "@/services/api";
import Footer from "@/components/Footer";

export default function AppointmentPaymentPage() {
  const { appointmentId } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [transactionId, setTransactionId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const backendUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace("/api", "");

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const res = await API.get(`/payments/${appointmentId}`);
        if (res.data.status === "success") {
          setPaymentData(res.data.data);
        }
      } catch (err: any) {
        showToast("error", err.response?.data?.message || "Failed to load payment details.");
      } finally {
        setLoading(false);
      }
    };

    if (appointmentId) {
      fetchPaymentDetails();
    }
  }, [appointmentId]);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId.trim()) {
      showToast("error", "Please enter a valid Transaction ID / Reference Number.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await API.post(`/payments/${appointmentId}/submit`, { transactionId });
      if (res.data.status === "success") {
        showToast("success", "Payment submitted successfully! Redirecting...");
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      }
    } catch (err: any) {
      showToast("error", err.response?.data?.message || "Failed to submit transaction verification.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Configuring secure payment...</span>
        </div>
      </div>
    );
  }

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mb-4" />
        <h2 className="font-heading font-bold text-slate-800 text-xl">Payment Details Unavailable</h2>
        <p className="text-slate-400 text-xs mt-1 max-w-sm">We could not locate active billing parameters for this appointment ID.</p>
        <button
          onClick={() => router.push("/tests")}
          className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-full text-xs font-bold cursor-pointer"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const patientName = paymentData.appointment?.patient?.name || "Patient";
  const amount = paymentData.amount || 0;
  const qrUrl = `${backendUrl}/payments/phonepe_qr.png?t=${Date.now()}`;

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col justify-between">
      <div className="max-w-md mx-auto px-6 py-16 w-full">
        
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

        {/* Card Header & Wrapper */}
        <div className="bg-white border border-slate-200/60 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6">
          <div className="text-center flex flex-col gap-2">
            <span className="text-[10px] text-blue-600 bg-blue-50 px-3 py-1 rounded-full font-bold uppercase tracking-wider self-center">
              UPI Payment Required
            </span>
            <h1 className="font-heading font-bold text-slate-800 text-xl sm:text-2xl mt-1">Complete Your Booking</h1>
            <p className="text-slate-400 text-xs leading-relaxed px-2">
              Scan the official diagnostic center PhonePe QR code to authenticate and lock your appointment slot.
            </p>
          </div>

          {/* Amount Box */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex justify-between items-center">
            <div>
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Total Amount</span>
              <span className="text-slate-600 text-xs font-medium">For {patientName}</span>
            </div>
            <span className="font-heading font-bold text-slate-800 text-2xl">₹{amount}</span>
          </div>

          {/* QR Code Container */}
          <div className="flex flex-col items-center justify-center bg-slate-50 border border-slate-200/50 rounded-2xl p-6 gap-3 relative overflow-hidden">
            <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-md max-w-[180px] aspect-square flex items-center justify-center overflow-hidden">
              <img
                src={qrUrl}
                alt="PhonePe Scanner QR"
                className="w-full h-full object-contain rounded-xl"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://placehold.co/180x180/2563eb/ffffff?text=Scan+To+Pay";
                }}
              />
            </div>
            
            <div className="flex flex-col items-center text-center">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <QrCode className="w-3.5 h-3.5 text-blue-600" />
                Scan to Pay
              </span>
              <span className="text-[10px] text-slate-400 font-semibold mt-0.5">UPI ID: multidiagnostic@ybl</span>
            </div>
          </div>

          {/* Input Transaction Form */}
          <form onSubmit={handleSubmitPayment} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Transaction ID / UPI Reference Number</label>
              <input
                type="text"
                placeholder="Enter 12-digit UPI Ref/TXN ID"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none text-slate-700 focus:border-blue-500 focus:bg-white transition-all font-mono"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-2xl text-xs font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Payment...</span>
                </>
              ) : (
                <>
                  <span>Verify & Confirm Booking</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Secure Badge */}
          <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-semibold border-t border-slate-100 pt-4">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Secure 256-bit Encrypted Transaction</span>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}
