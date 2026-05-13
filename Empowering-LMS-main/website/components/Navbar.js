"use client";
import React, { useEffect, useMemo, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Menu, X, User, LogOut, LayoutDashboard, ChevronDown, BookOpen } from "lucide-react";

import { useAuthContext } from "../context/AuthContext";
import LogoutModal from "./LogoutModal";
import { navigateToAdminPanel } from "../utils/adminNavigation";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const pathname = usePathname();
  const { isLogin, logout, userData, authToken } = useAuthContext();
  const profileRef = useRef(null);

  const navItems = useMemo(
    () => [
      { path: "/", label: "Home" },
      { path: "/about", label: "About" },
      { path: "/courses", label: "Courses" },
      { path: "/pricing", label: "Pricing" },
      { path: "/contact-us", label: "Contact" },
    ],
    []
  );

  const closeMenu = () => setIsOpen(false);
  const toggleMenu = () => setIsOpen((v) => !v);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    closeMenu();
    setIsProfileOpen(false);
  }, [pathname]);

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -12, transition: { duration: 0.15 } },
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMenu}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[90] lg:hidden cursor-pointer"
          />
        )}
      </AnimatePresence>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={() => {
          setIsLogoutModalOpen(false);
          logout();
        }}
      />

      <nav className="fixed top-0 inset-x-0 z-[100] bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center space-x-2">
              <img src="/logo.png" className="h-12 w-12 object-contain" alt="Logo" />
              <span className="text-2xl font-bold text-gray-900">
                Empowerings
              </span>
            </Link>

            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`font-medium transition-colors ${isActive
                      ? "text-emerald-700"
                      : "text-gray-700 hover:text-emerald-600"
                      }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="hidden lg:flex items-center space-x-4">
              {!isLogin ? (
                <>
                  <Link
                    href="/auth/login"
                    className="text-gray-700 hover:text-emerald-600 font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 p-1 pr-3 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="h-9 w-9 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700">
                      <User className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {userData?.account?.name || "Profile"}
                    </span>
                    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1 overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                          <p className="text-sm font-medium text-gray-900">Signed in as</p>
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {userData?.account?.email || "User"}
                          </p>
                        </div>

                        <div className="py-1">
                          <a
                            href={userData?.subscription?.paymentCompleted ? "#" : "/pricing"}
                            onClick={(e) => {
                              setIsProfileOpen(false);
                              if (userData?.subscription?.paymentCompleted) {
                                e.preventDefault();
                                navigateToAdminPanel(authToken);
                              }
                            }}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                          >
                            <BookOpen className="h-4 w-4 mr-2" />
                            Explore LMS
                          </a>
                          <button
                            onClick={() => {
                              setIsProfileOpen(false);
                              setIsLogoutModalOpen(true);
                            }}
                            className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            <div className="lg:hidden">
              <button
                type="button"
                onClick={toggleMenu}
                aria-label={isOpen ? "Close menu" : "Open menu"}
                className={`inline-flex items-center justify-center w-11 h-11 rounded-xl border text-white transition-colors cursor-pointer ${isOpen
                  ? "bg-emerald-600 border-emerald-600"
                  : "bg-emerald-500 border-emerald-500 hover:bg-emerald-600"
                  }`}
              >
                {isOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="lg:hidden absolute inset-x-0 top-full bg-white shadow-2xl z-[95]"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <ul className="flex flex-col font-medium space-y-1">
                  {navItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                      <li key={item.path}>
                        <Link
                          href={item.path}
                          onClick={closeMenu}
                          className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors duration-300 ${isActive
                            ? "text-emerald-700 bg-emerald-50"
                            : "text-gray-900 hover:text-emerald-700 hover:bg-gray-50"
                            }`}
                        >
                          <span>{item.label}</span>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </Link>
                      </li>
                    );
                  })}

                  {isLogin && (
                    <li className="border-t border-gray-100 mt-2 pt-2">
                      <a
                        href={userData?.subscription?.paymentCompleted ? "#" : "/pricing"}
                        onClick={(e) => {
                          closeMenu();
                          if (userData?.subscription?.paymentCompleted) {
                            e.preventDefault();
                            navigateToAdminPanel(authToken);
                          }
                        }}
                        className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors duration-300 ${pathname === "/dashboard"
                          ? "text-emerald-700 bg-emerald-50"
                          : "text-gray-900 hover:text-emerald-700 hover:bg-gray-50"
                          }`}
                      >
                        <span className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-2" />
                          Explore LMS
                        </span>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </a>
                    </li>
                  )}

                  <li className="border-t border-gray-200 pt-3 mt-2">
                    {!isLogin ? (
                      <div className="flex flex-col gap-2">
                        <Link
                          href="/auth/login"
                          onClick={closeMenu}
                          className="flex items-center justify-between px-4 py-3 rounded-lg text-gray-900 hover:text-emerald-700 hover:bg-gray-50 transition-colors duration-300"
                        >
                          <span>Sign In</span>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </Link>
                        <Link
                          href="/auth/signup"
                          onClick={closeMenu}
                          className="flex items-center justify-between px-4 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 transition-colors duration-300"
                        >
                          <span>Get Started</span>
                          <ChevronRight className="h-4 w-4 text-white/90" />
                        </Link>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          closeMenu();
                          setIsLogoutModalOpen(true);
                        }}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-300 cursor-pointer border border-red-100"
                      >
                        <span className="flex items-center">
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </span>
                        <ChevronRight className="h-4 w-4 text-red-400" />
                      </button>
                    )}
                  </li>
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navbar;

