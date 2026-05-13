import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiTrash2, FiAlertTriangle, FiLoader, FiUserMinus } from "react-icons/fi";
import { toast } from "react-hot-toast";
import axiosInstance from "../../../../../utils/axiosInstance";

const RemoveLearnersModal = ({
  isOpen,
  onClose,
  courseId,
  courseName,
  selectedLearners,
  selectedCount,
  onSuccess,
  onCancel,
}) => {
  const [removing, setRemoving] = useState(false);

  // Handle remove learners
  const handleRemoveLearners = async () => {
    if (selectedLearners.size === 0) {
      toast.error("No learners selected for removal");
      return;
    }

    try {
      setRemoving(true);
      const learnerIds = Array.from(selectedLearners);

      const response = await axiosInstance.delete(
        `/courses/${courseId}/learners`,
        { data: { learnerIds } }
      );

      if (response?.data?.success) {
        // Call success callback
        if (onSuccess) {
          onSuccess(response.data.data.removedCount);
        }
        
        // Close modal
        onClose();
      }
    } catch (error) {
      console.error("Error removing learners:", error);
      const errorMessage = error.response?.data?.message || "Failed to remove learners";
      toast.error(errorMessage);
    } finally {
      setRemoving(false);
    }
  };

  // Modal backdrop click handler
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={handleBackdropClick}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="relative w-full max-w-md bg-white rounded-2xl border border-emerald-100 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <FiTrash2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Remove Learners
                  </h2>
                  <p className="text-emerald-100 text-sm">
                    {courseName || "Course"}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white hover:scale-110 transition-all duration-200 cursor-pointer"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Warning Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-50 to-rose-100 flex items-center justify-center border-4 border-white shadow-lg">
                <FiAlertTriangle className="w-8 h-8 text-rose-500" />
              </div>
            </div>

            {/* Main Message */}
            <div className="text-center mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Remove {selectedCount} Learner{selectedCount > 1 ? 's' : ''}?
              </h3>
              <p className="text-gray-600">
                Are you sure you want to remove {selectedCount} learner{selectedCount > 1 ? 's' : ''} from this course? 
                They will lose access to all course materials.
              </p>
            </div>

            {/* Simple Info Box */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-emerald-700">Course:</span>
                <span className="text-sm font-medium text-emerald-900">{courseName || "Unknown Course"}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-emerald-700">To be removed:</span>
                <span className="text-sm font-medium text-rose-600">{selectedCount} learner{selectedCount > 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-emerald-700">Action:</span>
                <span className="text-sm font-medium text-rose-600">Irreversible</span>
              </div>
            </div>

            {/* Impact Note */}
            <div className="text-center">
              <p className="text-sm text-gray-500">
                This action cannot be undone. Learners will be immediately removed from the course.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-emerald-100 bg-emerald-50/30 px-6 py-4">
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                disabled={removing}
                className="px-5 py-2.5 border border-emerald-200 text-emerald-700 rounded-xl hover:bg-emerald-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleRemoveLearners}
                disabled={removing}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-xl hover:shadow-lg hover:from-rose-600 hover:to-rose-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-medium"
              >
                {removing ? (
                  <>
                    <FiLoader className="w-4 h-4 animate-spin" />
                    Removing...
                  </>
                ) : (
                  <>
                    <FiUserMinus className="w-4 h-4" />
                    Remove Learners
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default RemoveLearnersModal;