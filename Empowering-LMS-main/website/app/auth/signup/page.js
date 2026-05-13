"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { RiUserAddLine } from "react-icons/ri";
import toast from "react-hot-toast";
import { useAuthContext } from "../../../context/AuthContext";
import { navigateToAdminPanel } from "../../../utils/adminNavigation";

export default function Signup() {
  const router = useRouter();
  const { isLogin, isLoading, signup, userData, authToken } = useAuthContext();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (isLogin && userData) {
      if (userData.subscription?.paymentCompleted) {
        navigateToAdminPanel(authToken);
      } else {
        router.push("/pricing");
      }
    }
  }, [isLogin, userData, router]);

  const validate = () => {
    const newErrors = {};
    let hasErrors = false;

    if (!formData.name.trim()) {
      newErrors.name = "Company Name is required";
      hasErrors = true;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
      hasErrors = true;
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      hasErrors = true;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      hasErrors = true;
    }

    setErrors(newErrors);

    if (hasErrors) {
      const firstError = Object.values(newErrors)[0];
      toast.error(firstError, {
        position: "top-center",
        duration: 3000,
      });
    }

    return !hasErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      if (!validate()) return;

      setIsSubmitting(true);
      await signup(formData);
      // signup function handles navigation logic
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-gradient-to-br from-emerald-50 to-green-50 p-4">
      <div className="w-full max-w-xl relative">
        {/* Main Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-8 space-y-6"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
              <RiUserAddLine className="text-2xl text-white" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-800">
                Register Company
              </h1>
              <p className="text-gray-600 text-sm">
                Create a company profile and start managing
              </p>
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FiUser className={`${errors.name ? "text-red-500" : "text-gray-400"}`} />
                <label className={`text-sm font-medium ${errors.name ? "text-red-600" : "text-gray-700"}`}>
                  Company Name *
                </label>
              </div>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter Company / Organization Name..."
                  className={`w-full h-12 px-4 pl-11 bg-gray-50 border rounded-xl focus:outline-none transition-all duration-300
                    ${errors.name
                      ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-red-50"
                      : "border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    }
                    ${isLoading || isSubmitting ? "opacity-60" : ""}
                  `}
                  disabled={isLoading || isSubmitting}
                />
                <FiUser className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.name ? "text-red-500" : "text-gray-400"}`} />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FiMail className={`${errors.email ? "text-red-500" : "text-gray-400"}`} />
                <label className={`text-sm font-medium ${errors.email ? "text-red-600" : "text-gray-700"}`}>
                  Company Email *
                </label>
              </div>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="hr@acme.com"
                  className={`w-full h-12 px-4 pl-11 bg-gray-50 border rounded-xl focus:outline-none transition-all duration-300
                    ${errors.email
                      ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-red-50"
                      : "border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    }
                    ${isLoading || isSubmitting ? "opacity-60" : ""}
                  `}
                  disabled={isLoading || isSubmitting}
                />
                <FiMail className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.email ? "text-red-500" : "text-gray-400"}`} />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FiLock className={`${errors.password ? "text-red-500" : "text-gray-400"}`} />
                <label className={`text-sm font-medium ${errors.password ? "text-red-600" : "text-gray-700"}`}>
                  Password *
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full h-12 px-4 pl-11 pr-11 bg-gray-50 border rounded-xl focus:outline-none transition-all duration-300
                    ${errors.password
                      ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-red-50"
                      : "border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    }
                    ${isLoading || isSubmitting ? "opacity-60" : ""}
                  `}
                  disabled={isLoading || isSubmitting}
                />
                <FiLock className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.password ? "text-red-500" : "text-gray-400"}`} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FiLock className={`${errors.confirmPassword ? "text-red-500" : "text-gray-400"}`} />
                <label className={`text-sm font-medium ${errors.confirmPassword ? "text-red-600" : "text-gray-700"}`}>
                  Confirm Password *
                </label>
              </div>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full h-12 px-4 pl-11 pr-11 bg-gray-50 border rounded-xl focus:outline-none transition-all duration-300
                    ${errors.confirmPassword
                      ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-red-50"
                      : "border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    }
                    ${isLoading || isSubmitting ? "opacity-60" : ""}
                  `}
                  disabled={isLoading || isSubmitting}
                />
                <FiLock className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.confirmPassword ? "text-red-500" : "text-gray-400"}`} />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  name: "",
                  email: "",
                  password: "",
                  confirmPassword: "",
                });
                setErrors({});
                toast.success("Form cleared!");
              }}
              disabled={isLoading || isSubmitting}
              className="flex-1 h-12 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all duration-300 hover:border-gray-400 disabled:opacity-50 cursor-pointer"
            >
              Clear All
            </button>

            <button
              type="submit"
              disabled={isLoading || isSubmitting}
              className="group flex-1 h-12 rounded-xl bg-emerald-500 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100 cursor-pointer"
            >
              <div className="flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <RiUserAddLine className="group-hover:scale-110 transition-transform" />
                    <span>Create Account</span>
                  </>
                )}
              </div>
            </button>
          </div>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600 pt-4 border-t border-gray-100">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-emerald-600 font-medium hover:text-emerald-700 hover:underline transition-colors"
            >
              Sign In
            </Link>
          </p>
        </form>
      </div>

      {/* Decorative Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-200 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-green-200 rounded-full opacity-10 animate-pulse delay-1000"></div>
      </div>
    </div>
  );
}
