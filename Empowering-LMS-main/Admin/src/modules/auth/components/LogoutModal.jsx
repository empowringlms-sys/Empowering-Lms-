import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const LogoutModal = () => {
  const { logout, showLogoutModal, setShowLogoutModal } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
    } finally {
      setLoading(false);
    }
  };

  if (!showLogoutModal) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        className="fixed inset-0 z-50 flex justify-center items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => !loading && setShowLogoutModal(false)}
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }} // softer overlay
      >
        <motion.div
          key="modal"
          className="bg-white rounded-2xl shadow-2xl max-w-100 p-6 m-2 relative"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()} // prevent click inside modal from closing
        >
          <h3 className="text-xl font-semibold text-emerald-800 mb-3">
            Confirm Logout
          </h3>

          <p className="text-sm text-gray-600 mb-6">
            Are you sure you want to log out of your account?
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowLogoutModal(false)}
              disabled={loading}
              className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={handleLogout}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm flex items-center gap-2 hover:shadow-lg transition disabled:opacity-70 cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                  Logging out...
                </>
              ) : (
                "Logout"
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LogoutModal;
