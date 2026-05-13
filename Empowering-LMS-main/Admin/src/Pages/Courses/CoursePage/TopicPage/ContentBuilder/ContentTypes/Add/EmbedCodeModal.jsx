import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiCode, FiAlertTriangle, FiCopy } from "react-icons/fi";
import toast from "react-hot-toast";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 16,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

const codeTextareaVariants = {
  focus: {
    borderColor: "#10b981",
    boxShadow: "0 0 0 3px rgba(16, 185, 129, 0.1)",
    transition: { duration: 0.2 },
  },
};

const EmbedCodeModal = ({ onClose, onAdd, initialData }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [adding, setAdding] = useState(false);
  const [isCodeFocused, setIsCodeFocused] = useState(false);

  // 🔁 EDIT MODE (prefill)
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setCode(initialData.code || "");
    }
  }, [initialData]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!code.trim()) {
      toast.error("Embed code is required");
      return;
    }

    setAdding(true);
    await onAdd({ title, description, code });
    setAdding(false);
    toast.success("Embed code added successfully!");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && title.trim() && code.trim()) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleCopyCode = () => {
    if (code.trim()) {
      navigator.clipboard.writeText(code);
      toast.success("Code copied to clipboard!");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center px-2"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
      >
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
          className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden"
        >
          {/* HEADER */}
          <div className="px-6 py-4 flex justify-between items-center border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FiCode className="text-purple-600 text-lg" />
              </div>
              <h3 className="font-semibold text-gray-800">
                {initialData ? "Edit Embed Code" : "Add Embed Code"}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 transition cursor-pointer p-1 hover:bg-gray-100 rounded-lg"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* WARNING BANNER */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border-l-4 border-red-400 mx-6 mt-4 p-3 rounded-r-lg"
          >
            <div className="flex items-start gap-2">
              <FiAlertTriangle className="text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700 font-medium">
                Warning: Embedding code can cause issues if done incorrectly.
              </p>
            </div>
            <p className="text-xs text-red-600 mt-1 ml-6">
              Only use code from trusted sources.
            </p>
          </motion.div>

          {/* BODY */}
          <div className="px-6 py-5 space-y-4">
            {/* NAME */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Interactive Activity"
                value={title}
                autoFocus
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                className="
                  w-full rounded-xl border border-gray-200 
                  px-4 py-3 text-sm
                  focus:outline-none focus:ring-2 focus:ring-emerald-300
                  transition
                "
              />
            </div>

            {/* DESCRIPTION */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">
                Description
              </label>
              <textarea
                rows={2}
                placeholder="Optional description of what this embed does"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="
                  w-full rounded-xl border border-gray-200 
                  px-4 py-3 text-sm resize-none
                  focus:outline-none focus:ring-2 focus:ring-emerald-300
                  transition
                "
              />
            </div>

            {/* CODE AREA */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-600">
                  Embed Code <span className="text-red-500">*</span>
                </label>
                {code.trim() && (
                  <button
                    onClick={handleCopyCode}
                    className="
                      flex items-center gap-1 text-xs text-gray-500 
                      hover:text-emerald-600 transition cursor-pointer
                      px-2 py-1 hover:bg-gray-100 rounded
                    "
                  >
                    <FiCopy size={12} />
                    Copy
                  </button>
                )}
              </div>

              <motion.div
                variants={codeTextareaVariants}
                animate={isCodeFocused ? "focus" : ""}
                className="relative"
              >
                <textarea
                  rows={8}
                  placeholder="<iframe src='...'></iframe>"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onFocus={() => setIsCodeFocused(true)}
                  onBlur={() => setIsCodeFocused(false)}
                  className="
                    w-full rounded-xl border border-gray-200 
                    px-4 py-3 text-sm font-mono resize-none
                    focus:outline-none focus:ring-2 focus:ring-emerald-300
                    transition
                    bg-gray-50 text-gray-800
                  "
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  {["HTML", "JS", "CSS"].map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 bg-gray-200 text-gray-600 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>

              <p className="text-xs text-gray-400 mt-1">
                Supports: HTML, JavaScript, CSS, iframes, and embed codes
              </p>
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-3 px-6 pb-6">
            <button
              onClick={onClose}
              disabled={adding}
              className="
                px-4 py-2 rounded-lg text-sm 
                bg-gray-100 border border-gray-300 
                text-gray-600 hover:bg-gray-200 
                transition cursor-pointer
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={adding || !title.trim() || !code.trim()}
              className="
                px-5 py-2 rounded-lg text-sm font-medium
                bg-emerald-500 hover:bg-emerald-600 text-white
                transition disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center min-w-[110px] cursor-pointer
                disabled:hover:bg-emerald-500
              "
            >
              {adding ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Embedding...
                </span>
              ) : initialData ? (
                "Save Changes"
              ) : (
                "Embed Code"
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EmbedCodeModal;
