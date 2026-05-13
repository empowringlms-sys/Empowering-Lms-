import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { debugCookies, setTestCookie } from "../services/auth.api.js";
import LogoutModal from "../components/LogoutModal.jsx";

const AuthContext = createContext();

// Configure axios globally
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Auto login check
  const checkAuth = async () => {
    try {
      const res = await axios.get("/api/admin/me");
      setAdmin(res.data.admin);
    } catch (error) {
      console.error("Authentication failed:", {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        url: error.config?.url,
      });
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  // Initialize axios with token from localStorage
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    checkAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      if (import.meta.env.VITE_NODE_ENV === "development") {
        await setTestCookie();
      }
      const response = await axios.post("/api/admin/login", {
        email,
        password,
      });
      // Wait a moment for cookie to be set
      await new Promise((resolve) => setTimeout(resolve, 100));

      const { authToken } = response.data.data;

      if (authToken) {
        localStorage.setItem("admin_token", authToken);
        axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
      }

      // Verify authentication
      await checkAuth();

      toast.success("Login Successful");
      navigate("/home", { replace: true });

      return response.data;
    } catch (error) {
      console.error("Login error:", {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        data: error.response?.data,
      });

      toast.error(error.response?.data?.message || "Login failed");
      throw error;
    }
  };

  const loginWithSSO = async (token) => {
    try {
      const response = await axios.post("/api/admin/login-sso", { token });
      await new Promise((resolve) => setTimeout(resolve, 100));

      const { authToken } = response.data.data;
      if (authToken) {
        localStorage.setItem("admin_token", authToken);
        axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
      }

      await checkAuth();
      toast.success("Auto-login Successful");
      navigate("/home", { replace: true });
      return response.data;
    } catch (error) {
      console.error("SSO Login error:", error);
      toast.error("Auto-login failed. Please log in manually.");
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.post("/api/admin/logout");
      localStorage.removeItem("admin_token");
      delete axios.defaults.headers.common["Authorization"];

      setAdmin(null);
      setShowLogoutModal(false);
      toast.success("Logout Successful");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        isAuthenticated: !!admin,
        loading,
        login,
        logout,
        showLogoutModal,
        setShowLogoutModal,
        debugCookies, // Expose debug function
        checkAuth, // Expose checkAuth for manual refresh
        loginWithSSO,
      }}
    >
      {!loading && children}
      <LogoutModal />
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
