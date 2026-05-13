"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiMail, FiClock, FiRefreshCw } from "react-icons/fi";
import { RiShieldCheckLine } from "react-icons/ri";
import toast from "react-hot-toast";
import { useAuthContext } from "../../../context/AuthContext";
import { navigateToAdminPanel } from "../../../utils/adminNavigation";

export default function VerifyOTP() {
  const router = useRouter();
  const { isLogin, userData, verifyOTP, resendOTP, fetchOTPStatus, authToken } =
    useAuthContext();
  const otpInputRef = useRef(null);

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(0); // Seconds remaining
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isFetchingStatus, setIsFetchingStatus] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [serverExpiresAt, setServerExpiresAt] = useState(null);

  // Function to calculate remaining time with millisecond precision
  const calculateRemainingSeconds = (expiresAt) => {
    if (!expiresAt) return 0;
    const now = Date.now();
    const remainingMs = expiresAt - now;
    return Math.max(0, Math.floor(remainingMs / 1000));
  };

  // Function to load OTP status from server
  const loadOTPStatus = async () => {
    try {
      setIsFetchingStatus(true);
      const otpStatus = await fetchOTPStatus();

      if (otpStatus) {
        setServerExpiresAt(otpStatus.expiresAt);
        const remainingSeconds = calculateRemainingSeconds(otpStatus.expiresAt);
        setTimer(remainingSeconds);
        setCanResend(remainingSeconds === 0);
      } else {
        // If no OTP found, redirect to signin
        // But only if we are NOT logged in fully
        if (!userData || !userData.email) {
          toast.error("No active OTP session found. Please sign in again.");
          router.replace("/auth/login");
        }
      }
    } catch (error) {
      console.error("Failed to fetch OTP status:", error);
    } finally {
      setIsFetchingStatus(false);
    }
  };

  useEffect(() => {
    loadOTPStatus();
    const syncInterval = setInterval(() => {
      loadOTPStatus();
    }, 15000);

    return () => clearInterval(syncInterval);
  }, []);

  useEffect(() => {
    let interval;
    if (serverExpiresAt) {
      const initialRemaining = calculateRemainingSeconds(serverExpiresAt);
      setTimer(initialRemaining);
      setCanResend(initialRemaining === 0);

      interval = setInterval(() => {
        const remaining = calculateRemainingSeconds(serverExpiresAt);
        setTimer(remaining);
        setCanResend(remaining === 0);
        if (remaining <= 0) {
          clearInterval(interval);
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [serverExpiresAt]);

  useEffect(() => {
    if (otp.length === 6 && !isVerifying) {
      handleAutoSubmit();
    }
  }, [otp]);

  const handleAutoSubmit = async () => {
    if (otp.length !== 6 || isVerifying) return;

    try {
      setIsVerifying(true);
      await verifyOTP(otp);
      // verifyOTP handles navigation on success
    } catch (error) {
      console.log(error);
      setError("Invalid OTP code. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  // Check auth status
  useEffect(() => {
    if (isLogin && userData?.account?.isVerified) {
      if (userData.subscription?.paymentCompleted) {
        navigateToAdminPanel(authToken);
      } else {
        router.push("/pricing");
      }
    }
    // Check if we have userData (incomplete login)
    const token = localStorage.getItem("companyToken");
    if (!token) {
      router.replace("/auth/login");
    }
  }, [isLogin, userData, router]);

  useEffect(() => {
    otpInputRef.current?.focus();
  }, []);

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 6) {
      setOtp(value);
      if (error) setError("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "");
    if (pasteData.length <= 6) {
      setOtp(pasteData);
      if (error) setError("");
    }
  };

  const handleSubmit = async () => {
    if (otp.length !== 6) {
      setError("Please enter complete 6-digit OTP code");
      toast.error("Please enter complete 6-digit OTP code");
      return;
    }
    await handleAutoSubmit();
  };

  const handleResendOTP = async () => {
    try {
      setIsResending(true);
      const result = await resendOTP();

      if (result) {
        setServerExpiresAt(result.otpExpiresAt);
        const remainingSeconds = calculateRemainingSeconds(result.otpExpiresAt);
        setTimer(remainingSeconds);
        setCanResend(remainingSeconds === 0);

        setOtp("");
        setError("");
        otpInputRef.current?.focus();
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getOTPValidityText = () => {
    const minutes = serverExpiresAt ? Math.floor(calculateRemainingSeconds(serverExpiresAt) / 60) : 10;
    return `Enter the 6-digit code • OTP valid for ${minutes} minutes`;
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-gradient-to-br from-emerald-50 to-green-50 p-4">
      <div className="w-full max-w-md relative">
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
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
              <RiShieldCheckLine className="text-2xl text-white" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-800">
                Email Verification
              </h1>
              <p className="text-gray-600 text-sm">
                Enter the 6-digit code sent to
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full">
                <FiMail className={`text-sm text-emerald-500`} />
                <span className={`text-sm font-medium text-emerald-600`}>
                  {userData?.email || "your email"}
                </span>
              </div>
            </div>
          </div>

          {/* OTP Input */}
          <div className="space-y-5">
            <div className="space-y-3">
              <div className="relative">
                <input
                  ref={otpInputRef}
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength="6"
                  value={otp}
                  onChange={handleOtpChange}
                  onKeyDown={handleKeyDown}
                  onPaste={handlePaste}
                  disabled={isVerifying}
                  className={`w-full h-14 text-2xl font-bold text-center tracking-[5px] rounded-xl focus:outline-none transition-all duration-300
                  ${error
                      ? "border-2 border-red-500 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                      : "border-2 border-gray-200 bg-gray-50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 hover:border-emerald-300"
                    }
                  ${isVerifying ? "opacity-60" : ""}
                `}
                />

                {/* Progress Dots */}
                <div className="flex justify-center gap-2 mt-4">
                  {[...Array(6)].map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${index < otp.length
                        ? error
                          ? "bg-red-500"
                          : "bg-emerald-500"
                        : "bg-gray-300"
                        }`}
                    />
                  ))}
                </div>
              </div>

              {error && (
                <p className="text-xs text-red-500 text-center">{error}</p>
              )}
            </div>

            {/* Timer Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-4 py-3 bg-emerald-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${timer < 60 ? "bg-red-100" : "bg-emerald-100"
                        }`}
                    >
                      <FiClock
                        className={`text-lg ${timer < 60 ? "text-red-500" : "text-emerald-500"
                          }`}
                      />
                      {isFetchingStatus && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                          <FiRefreshCw className="w-2 h-2 text-white animate-spin" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Code expires in</p>
                    <p
                      className={`text-lg font-bold font-mono ${timer < 60 ? "text-red-500" : "text-emerald-600"
                        }`}
                    >
                      {formatTime(timer)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleResendOTP}
                  disabled={!canResend || isVerifying || isFetchingStatus || isResending}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer min-w-[85px]
                    ${canResend && !isResending
                      ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md hover:shadow-lg hover:scale-105"
                      : "bg-gray-100 text-gray-400"
                    }
                  `}
                >
                  {isResending ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </div>
                  ) : canResend ? (
                    <>
                      <FiRefreshCw />
                      <span>Resend</span>
                    </>
                  ) : (
                    "Wait"
                  )}
                </button>
              </div>

              {isFetchingStatus && (
                <p className="text-xs text-emerald-500 text-center">
                  Syncing with server...
                </p>
              )}
            </div>

            {/* Verify Button */}
            <button
              onClick={handleSubmit}
              disabled={isVerifying}
              className="group w-full h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100 cursor-pointer"
            >
              <div className="flex items-center justify-center gap-2">
                {isVerifying ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <RiShieldCheckLine className="group-hover:scale-110 transition-transform" />
                    <span>Verify Email</span>
                  </>
                )}
              </div>
            </button>
          </div>

          {/* Footer Note */}
          <div className="pt-4 border-t border-gray-100">
            <p className="text-xs text-center text-gray-500">
              {getOTPValidityText()}
            </p>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-200 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-green-200 rounded-full opacity-10 animate-pulse delay-1000"></div>
      </div>
    </div>
  );
}
