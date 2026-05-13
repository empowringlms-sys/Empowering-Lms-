import { motion, AnimatePresence } from "framer-motion";
import { FiAlertTriangle, FiTrash2, FiX } from "react-icons/fi";

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Learner",
  description = "Are you sure you want to delete this learner? This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  isLoading = false,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-rose-100 bg-gradient-to-r from-rose-50/50 to-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 flex items-center justify-center">
                      <FiAlertTriangle className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {title}
                    </h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-500 hover:text-gray-700 transition-colors duration-200 cursor-pointer"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <p className="text-gray-600 mb-6">{description}</p>

                <div className="flex items-center gap-3 p-4 bg-rose-50/50 rounded-xl border border-rose-100 mb-6">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 flex items-center justify-center">
                    <FiTrash2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-rose-800">
                      This action is irreversible
                    </p>
                    <p className="text-xs text-rose-600">
                      All associated data will be permanently removed
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 pt-0 flex items-center justify-end gap-3">
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-5 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-rose-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <FiTrash2 className="w-4 h-4" />
                      <span>{confirmText}</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}