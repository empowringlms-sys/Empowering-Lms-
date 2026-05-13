// src/modules/userAuth/AuthContext.jsx
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  useRef,
} from "react";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance/axiosInstance";
import { useNavigate } from "react-router-dom";
import LogoutConfirmation from "./LogoutConfirmation/LogoutConfirmation";
import { useCompanyProfileContext } from "../../modules/CompanyProfile/CompanyProfileContext";

const AuthContext = createContext();

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

const PRIVATE_ROUTES = ["/dashboard", "/profile"];
const PUBLIC_ROUTES = ["/signin", "/signup", "/otp-verify"];

export const AuthProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();
  const { setCompanyData, clearCompanyData } = useCompanyProfileContext();


  console.log(userData)


  // Prevents race conditions
  const hasHydrated = useRef(false);
  const hasCheckedAuth = useRef(false);

  /* ----------------------------------
     1️⃣ Hydrate token ONCE
  ---------------------------------- */
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setAuthToken(token);
    }
    hasHydrated.current = true;
  }, []);

  /* ----------------------------------
     2️⃣ Persist token safely
  ---------------------------------- */
  useEffect(() => {
    if (!hasHydrated.current) return;

    if (authToken) {
      localStorage.setItem("authToken", authToken);
    }
  }, [authToken]);

  /* ----------------------------------
     3️⃣ Run auth check ONLY ONCE
  ---------------------------------- */
  useEffect(() => {
    if (!hasHydrated.current || hasCheckedAuth.current) return;

    hasCheckedAuth.current = true;
    checkAuth();
  }, []);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setIsLogin(false);
      setUserData(null);
      setIsLoading(false);
      setIsAuthChecked(true);
      return;
    }

    try {
      const response = await axiosInstance.get("/users/login-by-token");

      if (response?.success) {
        setUserData(response.data.userData);
        if (response.data.companyData) {
          setCompanyData(response.data.companyData);
        }

        // Set isLogin based on verification status
        if (response.data.userData?.isVerified) {
          setIsLogin(true);

          // Auto-redirect if slug mismatch
          const currentPath = window.location.pathname;
          const userSlug = response.data.userData.companySlug;

          if (userSlug) {
            const pathSegments = currentPath.split('/').filter(Boolean);
            const currentSlug = pathSegments[0];

            if (currentSlug && currentSlug !== userSlug) {
              const newPath = pathSegments.length > 1
                ? `/${userSlug}/${pathSegments.slice(1).join('/')}`
                : `/${userSlug}/dashboard`;

              navigate(newPath, { replace: true });
            }
          }

        } else {
          // User has token but is not verified
          setIsLogin(false);
          // If unverified, maybe ensure they are on the right slug too? 
          // For now, focus on verified users.
        }

        // Update token ONLY if backend explicitly rotates it
        if (response.data.authToken && response.data.authToken !== token) {
          setAuthToken(response.data.authToken);
        }
      } else {
        logout(false);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      logout(false);
    } finally {
      setIsLoading(false);
      setIsAuthChecked(true);
    }
  }, []);

  /* ----------------------------------
     Auth Actions
  ---------------------------------- */

  const login = async (email, password, companySlug) => {
    try {
      setIsLoading(true);

      const response = await axiosInstance.post("/users/login", {
        email,
        password,
        companySlug, // Pass slug to backend
      });

      if (!response?.success) {
        throw new Error(response?.message || "Login failed");
      }

      const { authToken, userData, requiresOTP } = response.data;

      // Update auth state
      setAuthToken(authToken);
      setUserData(userData);
      if (response.data.companyData) setCompanyData(response.data.companyData);

      // Set isLogin based on verification status
      if (userData?.isVerified) {
        setIsLogin(true);
        toast.success("Login successful");
        // Maintain the current slug in redirect
        navigate(`/${companySlug}/dashboard`, { replace: true });
      } else {
        // User needs OTP verification
        setIsLogin(false);
        toast.success("OTP sent to your email");
        navigate(`/${companySlug}/otp-verify`, { replace: true });
      }

      return true;
    } catch (error) {
      toast.error(error.message || "Login failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (signupData) => {
    try {
      setIsLoading(true);

      const response = await axiosInstance.post("/users/signup", signupData);

      if (!response?.success) {
        throw new Error(response?.message || "Signup failed");
      }

      const { authToken, userData } = response.data;

      // Update auth state
      setAuthToken(authToken);
      setUserData(userData);
      setIsLogin(false);

      toast.success("OTP sent to your email");
      navigate("/otp-verify", { replace: true });

      return true;
    } catch (error) {
      toast.error(error.message || "Signup failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post("/users/resend-user-otp");

      if (response?.success) {
        toast.success("OTP resent successfully!");
        return response.data; // Return the data for immediate timer update
      }
      throw new Error(response?.message || "Failed to resend OTP");
    } catch (error) {
      toast.error(error.message || "Failed to resend OTP");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch OTP status from server (returns milliseconds precision)
  const fetchOTPStatus = async () => {
    try {
      const response = await axiosInstance.get("/users/otp-status");
      if (response?.success) {
        return {
          expiresAt: response.data.expiresAt, // Keep as milliseconds timestamp
          remainingTime: response.data.remainingTime, // Keep as milliseconds
          expiresIn: response.data.expiresIn,
        };
      }
      return null;
    } catch (error) {
      console.error("Error fetching OTP status:", error);
      return null;
    }
  };
  const verifyOTP = async (otp) => {
    try {
      setIsLoading(true);

      const response = await axiosInstance.post("/users/verify-user-otp", {
        otp,
      });

      if (!response?.success) {
        throw new Error(response?.message || "OTP verification failed");
      }

      const { authToken, userData } = response.data;

      // Update auth state after verification
      if (authToken) setAuthToken(authToken);
      if (userData) {
        setUserData(userData);
        if (response.data.companyData) setCompanyData(response.data.companyData);
        setIsLogin(true);
      }

      toast.success("Email verified successfully");
      navigate("/dashboard", { replace: true });

      return true;
    } catch (error) {
      toast.error(error.message || "OTP verification failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (showToast = true) => {
    localStorage.removeItem("authToken");
    setAuthToken(null);
    setUserData(null);
    clearCompanyData();
    setIsLogin(false);
    setIsLogoutModalOpen(false);
    if (showToast) toast.success("Logged out successfully");
    navigate("/signin", { replace: true });
  };

  const openLogoutModal = () => {
    setIsLogoutModalOpen(true);
  };

  const closeLogoutModal = () => {
    setIsLogoutModalOpen(false);
  };

  const confirmLogout = () => {
    logout(true);
  };

  // Helper function to check if user has a token (for OTP verification access)
  const hasAuthToken = () => {
    return !!authToken || !!localStorage.getItem("authToken");
  };

  const updateUserData = (data) => {
    setUserData(data);
  };

  const value = {
    isLogin,
    userData,
    updateUserData, // Expose updateUserData
    authToken,
    isLoading,
    isAuthChecked,
    login,
    signup,
    verifyOTP,
    resendOTP,
    logout: openLogoutModal,
    checkAuth,
    PRIVATE_ROUTES,
    PUBLIC_ROUTES,
    openLogoutModal,
    fetchOTPStatus,
    closeLogoutModal,
    confirmLogout,
    isLogoutModalOpen,
    hasAuthToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      <LogoutConfirmation />
    </AuthContext.Provider>
  );
};
