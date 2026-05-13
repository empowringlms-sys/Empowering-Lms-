import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiLock,
  FiMail,
  FiLogIn,
  FiEye,
  FiEyeOff,
  FiShield,
  FiKey,
  FiAlertCircle,
} from "react-icons/fi";

export default function AdminLogin() {
  const { login } = useAuth();

  const [email, setEmail] = useState("superadmin@gmail.com");
  const [password, setPassword] = useState("superadmin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [shakeError, setShakeError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setShakeError(false);

    // Basic validation
    if (!email || !password) {
      setError("Please fill in all fields");
      setShakeError(true);
      setTimeout(() => setShakeError(false), 500);
      return;
    }

    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError("Invalid email or password");
      setShakeError(true);
      setTimeout(() => setShakeError(false), 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="w-full max-w-md"
      >
        {/* Header with Logo */}
        {/* <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 mb-4 shadow-lg">
            <FiShield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-emerald-900 mb-2">
            Admin Portal
          </h1>
          <p className="text-emerald-600">
            Secure access to your administration dashboard
          </p>
        </div> */}

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 overflow-hidden">
          {/* Card Header */}
          <div className="px-8 py-6 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <FiKey className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-emerald-900">Sign In</h2>
                <p className="text-sm text-emerald-600">
                  Enter your credentials to continue
                </p>
              </div>
            </div>
          </div>

          {/* Card Body */}
          <div className="px-8 py-8">
            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3 ${shakeError ? "animate-shake" : ""
                      }`}
                  >
                    <FiAlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-rose-700">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-emerald-800 flex items-center gap-2">
                  <FiMail className="w-4 h-4" />
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400">
                    <FiMail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="w-full pl-11 pr-4 py-3 bg-white border border-emerald-200 rounded-xl focus:border-emerald-400 focus:ring-3 focus:ring-emerald-100 focus:outline-none transition-all duration-300 text-emerald-900 placeholder-emerald-400/60 disabled:bg-emerald-50 disabled:cursor-not-allowed"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-emerald-800 flex items-center gap-2">
                  <FiLock className="w-4 h-4" />
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400">
                    <FiLock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="w-full pl-11 pr-12 py-3 bg-white border border-emerald-200 rounded-xl focus:border-emerald-400 focus:ring-3 focus:ring-emerald-100 focus:outline-none transition-all duration-300 text-emerald-900 placeholder-emerald-400/60 disabled:bg-emerald-50 disabled:cursor-not-allowed"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-400 hover:text-emerald-600 transition-colors duration-200"
                  >
                    {showPassword ? (
                      <FiEyeOff className="w-5 h-5" />
                    ) : (
                      <FiEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              {/* <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-emerald-600 border-emerald-300 rounded focus:ring-emerald-200"
                  />
                  <span className="text-sm text-emerald-700">Remember me</span>
                </label>
                <a
                  href="#"
                  className="text-sm font-medium text-emerald-600 hover:text-emerald-800 hover:underline transition-colors duration-200"
                >
                  Forgot password?
                </a>
              </div> */}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold py-3.5 rounded-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    <FiLogIn className="w-5 h-5" />
                    Sign In to Dashboard
                  </>
                )}
              </motion.button>

              {/* Demo Credentials */}
              {/* <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-emerald-800 mb-2 flex items-center gap-2">
                  <FiKey className="w-4 h-4" />
                  Demo Credentials
                </h4>
                <div className="text-xs text-emerald-600 space-y-1">
                  <p>Email: <span className="font-medium">admin@gmail.com</span></p>
                  <p>Password: <span className="font-medium">admin123</span></p>
                </div>
              </div> */}
            </form>
          </div>

          {/* Card Footer */}
          {/* <div className="px-8 py-6 border-t border-emerald-100 bg-gradient-to-r from-white to-emerald-50/30">
            <p className="text-center text-sm text-emerald-600">
              Need help?{" "}
              <a href="#" className="font-medium text-emerald-700 hover:text-emerald-900 hover:underline">
                Contact Support
              </a>
            </p>
          </div> */}
        </div>

        {/* Security Notice */}
        {/* <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 text-xs text-emerald-500 bg-emerald-50/50 px-4 py-2 rounded-full">
            <FiShield className="w-3 h-3" />
            <span>Your login is secured with 256-bit encryption</span>
          </div>
        </div> */}
      </motion.div>

      {/* Add custom animation for shake */}
      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translateX(-5px);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translateX(5px);
          }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </section>
  );
}
