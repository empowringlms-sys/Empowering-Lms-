"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const AuthContext = createContext();
import { navigateToAdminPanel } from "../utils/adminNavigation";
// Adjust if your backend port is different, but user's server.js said 5000
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/companies`;

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("companyToken");
    if (token) {
      setAuthToken(token);
      checkAuth(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  const checkAuth = async (token) => {
    try {
      const res = await fetch(`${API_URL}/login-by-token`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success) {
        setUserData(data.data.userData);
        // Only set verified login if verified
        if (data.data.userData?.account?.isVerified) {
          setIsLogin(true);

          // Enforce flow check
          if (!data.data.userData.subscription?.paymentCompleted) {
            router.push("/pricing");
          }
          // if payment completed, stay on current page or dashboard
        } else {
          setIsLogin(false); // Token valid but not verified
          router.push("/auth/verify-otp");
        }
      } else {
        logout(false);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      logout(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Login failed");
      }

      const { authToken, userData } = data.data;

      localStorage.setItem("companyToken", authToken);
      setAuthToken(authToken);
      setUserData(userData);

      if (userData?.account?.isVerified) {
        setIsLogin(true);
        toast.success("Login successful");

        // Check if there is a pending checkout plan
        const pendingPlan = sessionStorage.getItem("pendingCheckoutPlan");

        if (pendingPlan) {
          const pendingMonths = sessionStorage.getItem("pendingCheckoutMonths");
          let redirectUrl = `/pricing?checkout_plan=${pendingPlan}`;
          if (pendingMonths) {
            redirectUrl += `&checkout_months=${pendingMonths}`;
          }

          // Clear storage after constructing URL to prevent stale state
          sessionStorage.removeItem("pendingCheckoutPlan");
          sessionStorage.removeItem("pendingCheckoutMonths");

          router.push(redirectUrl);
        } else if (!userData.subscription?.paymentCompleted) {
          router.push("/pricing");
        } else {
          navigateToAdminPanel(authToken);
        }

      } else {
        setIsLogin(false);
        toast.success("OTP sent to your email");
        router.push("/auth/verify-otp");
      }
      return true;
    } catch (error) {
      toast.error(error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (signupData) => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Signup failed");
      }

      const { authToken, userData } = data.data;

      localStorage.setItem("companyToken", authToken);
      setAuthToken(authToken);
      setUserData(userData);
      setIsLogin(false);

      toast.success("OTP sent to your email");
      router.push("/auth/verify-otp");

      return true;
    } catch (error) {
      toast.error(error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };



  const verifyOTP = async (otp) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("companyToken");

      const res = await fetch(`${API_URL}/verify-company-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ otp }),
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "OTP verification failed");
      }

      const { authToken: newToken, userData: newUserData } = data.data;

      if (newToken) {
        localStorage.setItem("companyToken", newToken);
        setAuthToken(newToken);
      }
      if (newUserData) {
        setUserData(newUserData);
        setIsLogin(true);

        toast.success("Email verified successfully");

        // Check for pending plan or payment status
        const pendingPlan = sessionStorage.getItem("pendingCheckoutPlan");

        if (pendingPlan) {
          const pendingMonths = sessionStorage.getItem("pendingCheckoutMonths");
          let redirectUrl = `/pricing?checkout_plan=${pendingPlan}`;
          if (pendingMonths) {
            redirectUrl += `&checkout_months=${pendingMonths}`;
          }

          // Clear storage after constructing URL to prevent stale state
          sessionStorage.removeItem("pendingCheckoutPlan");
          sessionStorage.removeItem("pendingCheckoutMonths");

          router.push(redirectUrl);
        } else if (!newUserData.subscription?.paymentCompleted) {
          router.push("/pricing");
        } else {
          navigateToAdminPanel(newToken || token);
        }
      }

      return true;
    } catch (error) {
      toast.error(error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    try {
      const token = localStorage.getItem("companyToken");
      const res = await fetch(`${API_URL}/resend-company-otp`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success) {
        toast.success("OTP resent successfully!");
        return data.data;
      }
      throw new Error(data.message || "Failed to resend OTP");
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const fetchOTPStatus = async () => {
    try {
      const token = localStorage.getItem("companyToken");
      if (!token) return null;

      const res = await fetch(`${API_URL}/otp-status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        return {
          expiresAt: data.data.expiresAt,
          remainingTime: data.data.remainingTime,
          expiresIn: data.data.expiresIn
        };
      }
      return null;
    } catch (error) {
      console.error("Error fetching OTP status:", error);
      return null;
    }
  };

  const logout = (showToast = true) => {
    localStorage.removeItem("companyToken");
    setAuthToken(null);
    setUserData(null);
    setIsLogin(false);
    if (showToast) toast.success("Logged out");
    router.push("/auth/login");
  };

  return (
    <AuthContext.Provider
      value={{
        isLogin,
        userData,
        authToken,
        isLoading,
        login,
        signup,
        verifyOTP,
        resendOTP,
        logout,
        logout,
        fetchOTPStatus,
        setUserData, // Exposed for updates
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
