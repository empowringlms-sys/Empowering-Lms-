// src/components/LogoutConfirmation.jsx
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineExclamationCircle, HiX } from "react-icons/hi";
import { useAuthContext } from "../AuthContext";

const LogoutConfirmation = () => {
  const { isLogoutModalOpen, closeLogoutModal, confirmLogout } =
    useAuthContext();

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: -20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 25 },
    },
    exit: { opacity: 0, scale: 0.9, y: 20 },
  };

  const handleConfirm = () => {
    confirmLogout();
  };

  return (
    <AnimatePresence>
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={closeLogoutModal}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-10 w-full max-w-md mx-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <HiOutlineExclamationCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Confirm Logout
                  </h3>
                </div>
                <button
                  onClick={closeLogoutModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition cursor-pointer"
                >
                  <HiX className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-600 mb-2">
                  Are you sure you want to logout?
                </p>
                <p className="text-sm text-gray-500">
                  You will need to sign in again to access your dashboard.
                </p>
              </div>

              {/* Footer - Actions */}
              <div className="flex gap-3 p-6 bg-gray-50">
                <button
                  onClick={closeLogoutModal}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition duration-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition duration-200 shadow-md cursor-pointer"
                >
                  Yes, Logout
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LogoutConfirmation;
