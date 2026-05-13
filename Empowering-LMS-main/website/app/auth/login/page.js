"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { RiShieldUserLine } from "react-icons/ri";
import toast from "react-hot-toast";
import { useAuthContext } from "../../../context/AuthContext";
import { navigateToAdminPanel } from "../../../utils/adminNavigation";

export default function Login() {
  const router = useRouter();
  const { isLogin, isLoading, login, userData, authToken } = useAuthContext();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Auto redirect if already authenticated
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

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
      hasErrors = true;
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
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
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      await login(formData.email, formData.password);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-gradient-to-br from-emerald-50 to-green-50 p-4">
      <div className="w-full max-w-xl relative">
        {/* Back Button */}
        {/* <button
          onClick={() => router.back()}
          className="absolute -top-12 left-0 flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-all duration-200 group"
        >
          <div className="p-2 rounded-full bg-white shadow-sm group-hover:shadow-md transition-shadow">
            <FiArrowLeft className="text-lg group-hover:-translate-x-0.5 transition-transform" />
          </div>
        </button> */}

        {/* Main Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-8 space-y-6"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
              <RiShieldUserLine className="text-2xl text-white" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-800">Company Login</h1>
              <p className="text-gray-600 text-sm">
                Sign in to manage your company profile
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FiMail
                  className={`${errors.email ? "text-red-500" : "text-gray-400"
                    }`}
                />
                <label
                  className={`text-sm font-medium ${errors.email ? "text-red-600" : "text-gray-700"
                    }`}
                >
                  Email Address
                </label>
              </div>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="company@example.com"
                  className={`w-full h-12 px-4 pl-11 bg-gray-50 border rounded-xl focus:outline-none transition-all duration-300
                    ${errors.email
                      ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-red-50"
                      : "border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    }
                    ${isLoading || isSubmitting ? "opacity-60" : ""}
                  `}
                  disabled={isLoading || isSubmitting}
                />
                <FiMail
                  className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.email ? "text-red-500" : "text-gray-400"
                    }`}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FiLock
                  className={`${errors.password ? "text-red-500" : "text-gray-400"
                    }`}
                />
                <label
                  className={`text-sm font-medium ${errors.password ? "text-red-600" : "text-gray-700"
                    }`}
                >
                  Password
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
                <FiLock
                  className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.password ? "text-red-500" : "text-gray-400"
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || isSubmitting}
            className="group w-full h-12 rounded-xl bg-emerald-500 text-white font-semibold shadow-md disabled:opacity-60 cursor-pointer transition-transform duration-300 ease-out hover:scale-[1.02]"
          >
            <div className="flex items-center justify-center gap-2">
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <FiArrowLeft className="rotate-180 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </div>
          </button>

          {/* Signup Link */}
          <p className="text-center text-sm text-gray-600 pt-2">
            Don't have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-emerald-600 font-medium hover:text-emerald-700 hover:underline transition-colors"
            >
              Create account
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

