"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  CalendarDays,
  FileSpreadsheet,
  Bell,
  User,
  Users,
  TestTube,
  Layers,
  FileUp,
  LogOut,
  Activity,
  ChevronRight,
  CreditCard
} from "lucide-react";

interface SidebarProps {
  isAdmin?: boolean;
}

const DashboardSidebar: React.FC<SidebarProps> = ({ isAdmin = false }) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const patientLinks = [
    { name: "Overview", path: "/dashboard", icon: LayoutDashboard },
    { name: "Appointments", path: "/dashboard/appointments", icon: CalendarDays },
    { name: "Medical Reports", path: "/dashboard/reports", icon: FileSpreadsheet },
    { name: "Notifications", path: "/dashboard/notifications", icon: Bell },
    { name: "My Profile", path: "/dashboard/profile", icon: User },
  ];

  const adminLinks = [
    { name: "Overview & Stats", path: "/admin", icon: LayoutDashboard },
    { name: "Patients Manager", path: "/admin/patients", icon: Users },
    { name: "Publish Reports", path: "/admin/reports", icon: FileUp },
    { name: "Payments Ledger", path: "/admin/payments", icon: CreditCard },
    { name: "Appointments List", path: "/admin/appointments", icon: CalendarDays },
    { name: "Manage Lab Tests", path: "/admin/tests", icon: TestTube },
    { name: "Manage Packages", path: "/admin/packages", icon: Layers },
    { name: "Manage Users", path: "/admin/users", icon: Activity },
  ];

  const links = isAdmin ? adminLinks : patientLinks;

  return (
    <aside className="w-full lg:w-72 bg-white lg:min-h-[calc(100vh-80px)] border-r border-slate-100 flex flex-col justify-between py-8 px-4 flex-shrink-0">
      <div className="flex flex-col gap-8">
        {/* User Card */}
        {user && (
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center gap-3">
            <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <h4 className="font-heading font-bold text-slate-800 text-sm truncate">{user.name}</h4>
              <p className="text-xs text-slate-400 font-medium capitalize mt-0.5">{user.role}</p>
            </div>
          </div>
        )}

        {/* Navigation Grid */}
        <nav className="flex flex-col gap-1.5">
          {links.map((link) => {
            const isActive = pathname === link.path;
            const Icon = link.icon;

            return (
              <Link
                key={link.name}
                href={link.path}
                className={`flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm transition-all group ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 transition-colors ${isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-700"}`} />
                  <span>{link.name}</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? "text-blue-600 translate-x-0" : "text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1"}`} />
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout Action */}
      <button
        onClick={logout}
        className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-red-500 hover:bg-red-50/50 hover:text-red-600 transition-all cursor-pointer mt-8 lg:mt-0"
      >
        <LogOut className="w-5 h-5 text-red-400 group-hover:text-red-500" />
        <span>Logout Session</span>
      </button>
    </aside>
  );
};

export default DashboardSidebar;
