"use client";

import React, { useState, useEffect } from "react";
import { FileText, Download, Printer, CheckCircle2, AlertTriangle, ArrowDown, ArrowUp, ChevronDown, ChevronUp } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardSidebar from "@/components/DashboardSidebar";
import API from "@/services/api";


export default function PatientReports() {
  const [reports, setReports] = useState<any[]>([]);
  const [expandedReportId, setExpandedReportId] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await API.get("/reports/my");
        if (res.data.status === "success") {
          setReports(res.data.data);
          if (res.data.data.length > 0) {
            setExpandedReportId(res.data.data[0]._id);
          }
        }
      } catch {
        setReports([]);
      }
    };
    fetchReports();
  }, []);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <ProtectedRoute allowedRoles={["patient"]}>
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Core Content */}
        <main className="flex-grow flex flex-col gap-8 overflow-hidden">
          
          <div className="border-b border-slate-200/60 pb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h1 className="font-heading font-bold text-slate-800 text-2xl">Medical Lab Reports</h1>
              <p className="text-slate-400 text-xs mt-1">Access certified blood assays, cardiovascular values, and hormonal ranges.</p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {reports.map((report) => {
              const isExpanded = expandedReportId === report._id;
              return (
                <div key={report._id} className="bg-white border border-slate-200/50 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                  
                  {/* Summary Bar */}
                  <div
                    onClick={() => setExpandedReportId(isExpanded ? null : report._id)}
                    className="p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-50 text-emerald-600 p-2.5 rounded-xl flex-shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-slate-800 text-sm">
                          {report.appointment?.packages?.[0]?.name || report.appointment?.tests?.[0]?.name || "Laboratory Diagnostic Assays"}
                        </h3>
                        <p className="text-slate-400 text-[10px] mt-0.5 font-medium">
                          Report Released: {new Date(report.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        Ready
                      </span>
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                    </div>
                  </div>

                  {/* Expansion metrics */}
                  {isExpanded && (
                    <div className="border-t border-slate-100 p-6 flex flex-col gap-6 bg-slate-50/20">
                      
                      {/* Metric Table Header */}
                      <div className="grid grid-cols-4 gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-3">
                        <span>Test Parameter</span>
                        <span>Value Observed</span>
                        <span>Reference Interval</span>
                        <span className="text-right">Status Cues</span>
                      </div>

                      {/* Metric values list */}
                      <div className="flex flex-col gap-3">
                        {report.metrics?.map((m: any, idx: number) => (
                          <div key={idx} className="grid grid-cols-4 gap-4 text-xs font-semibold items-center text-slate-700 py-1">
                            <span className="truncate">{m.name}</span>
                            <span className="text-slate-800 font-bold">{m.value} {m.unit}</span>
                            <span className="text-slate-400 font-medium">{m.referenceRange} {m.unit}</span>
                            <div className="flex justify-end">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border ${
                                m.status === "Normal"
                                  ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                  : m.status === "Low"
                                  ? "bg-amber-50 text-amber-600 border-amber-200"
                                  : "bg-red-50 text-red-600 border-red-200"
                              }`}>
                                {m.status === "Normal" ? (
                                  <CheckCircle2 className="w-3 h-3" />
                                ) : m.status === "Low" ? (
                                  <ArrowDown className="w-3 h-3" />
                                ) : (
                                  <ArrowUp className="w-3 h-3" />
                                )}
                                <span>{m.status}</span>
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Doctor Clinical Remarks */}
                      {report.clinicalRemarks && (
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-2 mt-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hematologist Advisory Remarks</span>
                          <p className="text-slate-500 text-xs leading-relaxed font-medium">{report.clinicalRemarks}</p>
                        </div>
                      )}

                      {/* Downloader toolbar */}
                      <div className="flex justify-end gap-3 mt-4 border-t border-slate-100 pt-5">
                        <button
                          onClick={handlePrint}
                          className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                        >
                          <Printer className="w-4 h-4" />
                          <span>Print Assays</span>
                        </button>
                        {report.fileUrl && (
                          <a
                            href={report.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-blue-500/10 cursor-pointer"
                          >
                            <Download className="w-4 h-4" />
                            <span>Download certified PDF</span>
                          </a>
                        )}
                      </div>

                    </div>
                  )}

                </div>
              );
            })}

            {reports.length === 0 && (
              <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center shadow-sm">
                <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="font-heading font-bold text-slate-800 text-lg">No Reports Published</h3>
                <p className="text-slate-400 text-sm mt-2">Your results will populate once phlebotomy samples undergo certified laboratory processing.</p>
              </div>
            )}
          </div>

        </main>
      </div>
    </ProtectedRoute>
  );
}
