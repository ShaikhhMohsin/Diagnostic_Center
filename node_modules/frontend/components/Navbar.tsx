"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Activity, User, LogOut, LayoutDashboard, Shield } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Tests", path: "/tests" },
    { name: "Packages", path: "/packages" },
    { name: "Home Collection", path: "/home-collection" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2.5 rounded-2xl text-white shadow-md shadow-blue-500/20">
              <Activity className="h-6 w-6" />
            </div>
            <span className="font-heading font-bold text-xl text-slate-800 tracking-tight">
              Multi<span className="text-blue-600">Diag</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  className={`font-medium text-sm transition-colors relative py-2 ${
                    isActive ? "text-blue-600" : "text-slate-600 hover:text-blue-600"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Auth Buttons (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-3 bg-slate-50 hover:bg-slate-100 px-4 py-2 rounded-2xl border border-slate-200 transition-all cursor-pointer"
                >
                  <div className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{user.name.split(" ")[0]}</span>
                  {user.role === "admin" && (
                    <span className="text-[10px] bg-red-100 text-red-600 border border-red-200 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      Admin
                    </span>
                  )}
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {showDropdown && (
                    <>
                      {/* Invisible backdrop to click away */}
                      <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-3 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl z-20 py-2"
                      >
                        <div className="px-4 py-3 border-b border-slate-50">
                          <p className="text-xs text-slate-400 font-medium">Logged in as</p>
                          <p className="text-sm font-bold text-slate-800 truncate">{user.email}</p>
                        </div>

                        <Link
                          href={user.role === "admin" ? "/admin" : "/dashboard"}
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors font-medium"
                        >
                          <LayoutDashboard className="w-4 h-4 text-slate-500" />
                          Dashboard Overview
                        </Link>

                        <button
                          onClick={() => {
                            setShowDropdown(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50/50 transition-colors font-medium text-left cursor-pointer"
                        >
                          <LogOut className="w-4 h-4 text-red-500" />
                          Logout
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-slate-600 hover:text-blue-600 font-semibold transition-colors px-4 py-2.5 text-sm"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/10 transition-all text-sm"
                >
                  Book Appointment
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-blue-600 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-100"
          >
            <div className="px-4 pt-2 pb-6 space-y-2 shadow-lg">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-3 rounded-2xl text-base font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50/60 transition-all"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 flex flex-col space-y-3 border-t border-slate-100 mt-4">
                {user ? (
                  <>
                    <div className="px-3 py-2 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Session Active</p>
                        <p className="font-bold text-slate-800">{user.name}</p>
                      </div>
                      {user.role === "admin" && (
                        <span className="text-[10px] bg-red-100 text-red-600 border border-red-200 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                          Admin
                        </span>
                      )}
                    </div>
                    <Link
                      href={user.role === "admin" ? "/admin" : "/dashboard"}
                      onClick={() => setIsOpen(false)}
                      className="w-full text-center flex items-center justify-center gap-2 border border-slate-200 text-slate-700 px-4 py-3 rounded-full hover:bg-slate-50 transition-all font-semibold"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        logout();
                      }}
                      className="w-full text-center flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-3 rounded-full hover:bg-red-100 transition-all font-semibold cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="w-full text-center text-slate-700 border border-slate-200 px-4 py-3 rounded-full font-semibold hover:bg-slate-50 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsOpen(false)}
                      className="w-full text-center bg-blue-600 text-white px-4 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Book Appointment
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
