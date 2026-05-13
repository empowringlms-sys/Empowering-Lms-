import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiLink,
  FiExternalLink,
  FiGlobe,
  FiMinimize,
  FiX,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { IoMdCloseCircleOutline } from "react-icons/io";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

const AddLinkInTopicModal = ({ onClose, onAdd, loading, initialData }) => {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [isButton, setIsButton] = useState(false);
  const [openType, setOpenType] = useState("new");

  // Initialize with data if editing
  React.useEffect(() => {
    if (initialData) {
      if (initialData.title) setName(initialData.title);
      if (initialData.href || initialData.url) setUrl(initialData.href || initialData.url);
      if (initialData.isButton !== undefined) setIsButton(initialData.isButton);
      if (initialData.openType) setOpenType(initialData.openType);
    }
  }, [initialData]);

  // Color Theme Variables
  const theme = {
    primary: {
      50: "#f0fdfa",
      100: "#ccfbf1",
      200: "#99f6e4",
      300: "#5eead4",
      400: "#2dd4bf",
      500: "#14b8a6",
      600: "#0d9488",
      700: "#0f766e",
      800: "#115e59",
      900: "#134e4a",
    },
    secondary: {
      50: "#f8fafc",
      100: "#f1f5f9",
      200: "#e2e8f0",
      300: "#cbd5e1",
      400: "#94a3b8",
      500: "#64748b",
      600: "#475569",
      700: "#334155",
      800: "#1e293b",
      900: "#0f172a",
    },
    accent: {
      50: "#fdf4ff",
      100: "#fae8ff",
      200: "#f5d0fe",
      300: "#f0abfc",
      400: "#e879f9",
      500: "#d946ef",
      600: "#c026d3",
      700: "#a21caf",
      800: "#86198f",
      900: "#701a75",
    },
  };

  // Validate URL
  const isValidUrl = (value) => {
    if (!value) return false;
    try {
      const urlObj = new URL(value);
      return urlObj.protocol === "http:" || urlObj.protocol === "https:";
    } catch {
      return false;
    }
  };

  const handleAdd = () => {
    // Validate name
    if (!name.trim()) {
      toast.error("Please enter a link name", {
        style: {
          background: theme.secondary[800],
          color: theme.secondary[50],
          border: `1px solid ${theme.primary[600]}`,
        },
        iconTheme: {
          primary: theme.accent[400],
          secondary: theme.secondary[50],
        },
      });
      return;
    }

    // Validate URL
    if (!url.trim()) {
      toast.error("Please enter a URL", {
        style: {
          background: theme.secondary[800],
          color: theme.secondary[50],
          border: `1px solid ${theme.primary[600]}`,
        },
        iconTheme: {
          primary: theme.accent[400],
          secondary: theme.secondary[50],
        },
      });
      return;
    }

    if (!isValidUrl(url)) {
      toast.error(
        "Please enter a valid URL (must start with http:// or https://)",
        {
          style: {
            background: theme.secondary[800],
            color: theme.secondary[50],
            border: `1px solid ${theme.primary[600]}`,
          },
          iconTheme: {
            primary: theme.accent[400],
            secondary: theme.secondary[50],
          },
        }
      );
      return;
    }

    // Prepare link data
    const linkData = {
      title: name.trim(),
      href: url.trim(),
      isButton,
      openType,
    };

    // Call onAdd with the link data
    onAdd(linkData);
  };

  // Generate URL preview
  const getUrlPreview = () => {
    if (!url.trim()) return null;

    try {
      const urlObj = new URL(url);
      return (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-3 bg-gradient-to-br from-primary-50/80 to-secondary-50/80 rounded-xl border border-primary-200/50 backdrop-blur-sm"
          style={{
            background: `linear-gradient(135deg, ${theme.primary[50]}80, ${theme.secondary[50]}80)`,
            borderColor: `${theme.primary[200]}80`,
          }}
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary-100 to-primary-200">
              <FiGlobe
                className="w-4 h-4"
                style={{ color: theme.primary[600] }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-xs font-semibold mb-1"
                style={{ color: theme.primary[800] }}
              >
                URL Preview
              </p>
              <p
                className="text-xs truncate"
                style={{ color: theme.secondary[600] }}
              >
                <span
                  className="font-medium"
                  style={{ color: theme.primary[700] }}
                >
                  Host:
                </span>{" "}
                {urlObj.hostname}
              </p>
              <p
                className="text-xs truncate"
                style={{ color: theme.secondary[600] }}
              >
                <span
                  className="font-medium"
                  style={{ color: theme.primary[700] }}
                >
                  Path:
                </span>{" "}
                {urlObj.pathname || "/"}
              </p>
            </div>
          </div>
        </motion.div>
      );
    } catch {
      return null;
    }
  };

  // Get button style preview
  const getButtonPreview = () => {
    if (!isButton || !name.trim()) return null;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mt-4 p-4 rounded-xl border bg-gradient-to-br from-secondary-50/50 to-white"
        style={{
          borderColor: theme.secondary[200],
          background: `linear-gradient(135deg, ${theme.secondary[50]}80, white)`,
        }}
      >
        <p
          className="text-xs font-medium mb-3"
          style={{ color: theme.secondary[600] }}
        >
          Button Preview:
        </p>
        <div className="flex items-center justify-center cursor-pointer">
          <div
            className={`
            inline-flex items-center gap-2 px-5 py-2.5 font-medium rounded-xl
            transition-all duration-300 transform hover:scale-101 active:scale-95   cursor-pointer
            ${openType === "new"
                ? "bg-gradient-to-br from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg shadow-primary-500/3 bg-[#10a394] w-full  cursor-pointer"
                : "bg-gradient-to-br from-primary-400 to-primary-500 hover:from-primary-500 hover:to-primary-600 text-white shadow-lg shadow-primary-400/30s"
              }
          `}
          >
            <span>{name || "Link Name"}</span>
            {openType === "new" && <FiExternalLink className="w-3.5 h-3.5" />}
          </div>
        </div>
      </motion.div>
    );
  };

  // Get link style preview
  const getLinkPreview = () => {
    if (isButton || !name.trim()) return null;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mt-4 p-4 rounded-xl border bg-gradient-to-br from-secondary-50/50 to-white"
        style={{
          borderColor: theme.secondary[200],
          background: `linear-gradient(135deg, ${theme.secondary[50]}80, white)`,
        }}
      >
        <p
          className="text-xs font-medium mb-3"
          style={{ color: theme.secondary[600] }}
        >
          Link Preview:
        </p>
        <div className="flex items-center gap-2.5 group">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary-100 to-primary-50 group-hover:from-primary-200 transition-all duration-300 ">
            <FiLink className="w-4 h-4" style={{ color: theme.primary[500] }} />
          </div>
          <span
            className="text-sm font-medium group-hover:underline transition-all duration-300"
            style={{
              color: theme.primary[600],
              textDecorationColor: theme.primary[300],
            }}
          >
            {name || "Link Name"}
          </span>
          {openType === "new" && (
            <FiExternalLink
              className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              style={{ color: theme.primary[400] }}
            />
          )}
        </div>
      </motion.div>
    );
  };

  const isFormValid = name.trim() && url.trim();

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[60] flex items-center justify-center px-2 md:p-6 shadow-2xl bg-gray-900/70"
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
          className="w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border my-3"
          style={{
            background: "linear-gradient(135deg, white, #f8fafc)",
            borderColor: theme.secondary[200],
          }}
        >
          {/* HEADER */}
          <div
            className="px-6 py-3 border-b flex justify-between items-center bg-gradient-to-r from-white to-primary-50/50 my-3"
            style={{ borderColor: theme.secondary[200] }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 shadow-sm">
                <FiLink
                  className="text-lg"
                  style={{ color: theme.primary[600] }}
                />
              </div>
              <div>
                <h3
                  className="font-bold text-lg"
                  style={{ color: theme.secondary[900] }}
                >
                  {initialData ? 'Edit Link' : 'Add New Link'}
                </h3>
                <p className="text-sm" style={{ color: theme.secondary[500] }}>
                  {initialData ? 'Update link details' : 'Add a link to your topic content'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-secondary-100 transition-all duration-300 group"
              style={{ color: theme.secondary[400] }}
            >
              <div className="text-xl font-bold group-hover:scale-110 transition-transform cursor-pointer  text-gray-600 hover:text-gray-700">
                <IoMdCloseCircleOutline size={25} />
              </div>
            </button>
          </div>

          {/* CONTENT */}
          <div className="p-6 max-h-[70vh] md:max-h-[75vh] overflow-y-auto">
            {/* Link Name */}
            <div className="mb-6">
              <label
                className="block text-sm font-semibold mb-2.5"
                style={{ color: theme.secondary[700] }}
              >
                Link Name <span style={{ color: theme.accent[500] }}>*</span>
              </label>
              <input
                type="text"
                placeholder="Enter link name (e.g., Course Resources)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="
                  w-full rounded-xl border px-4 py-3.5 text-sm
                  focus:outline-none focus:ring-3 focus:shadow-lg transition-all duration-300
                  placeholder:font-normal
                "
                style={{
                  borderColor: theme.secondary[300],
                  color: theme.secondary[900],
                  backgroundColor: "white",
                  boxShadow: `0 2px 4px ${theme.secondary[100]}`,
                }}
              />
            </div>

            {/* Link URL */}
            <div className="mb-6">
              <label
                className="block text-sm font-semibold mb-2.5"
                style={{ color: theme.secondary[700] }}
              >
                URL <span style={{ color: theme.accent[500] }}>*</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <FiGlobe
                    className="w-4 h-4"
                    style={{ color: theme.primary[500] }}
                  />
                </div>
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="
                    w-full rounded-xl border pl-11 pr-4 py-3.5 text-sm
                    focus:outline-none focus:ring-3 focus:shadow-lg transition-all duration-300
                    placeholder:font-normal
                  "
                  style={{
                    borderColor: theme.secondary[300],
                    color: theme.secondary[900],
                    backgroundColor: "white",
                    boxShadow: `0 2px 4px ${theme.secondary[100]}`,
                  }}
                />
              </div>
              {getUrlPreview()}
            </div>

            {/* Display Options */}
            <div className="space-y-6">
              {/* Open Type Selection */}
              <div className="mb-6">
                <label
                  className="block text-sm font-semibold mb-3"
                  style={{ color: theme.secondary[700] }}
                >
                  Open Link In
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "new", icon: FiExternalLink, label: "New Tab" },
                    { value: "same", icon: FiMinimize, label: "Same Tab" },
                  ].map((option) => (
                    <motion.button
                      key={option.value}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setOpenType(option.value)}
                      className={`
                        flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl border
                        transition-all duration-300 cursor-pointer relative overflow-hidden
                        ${openType === option.value
                          ? "shadow-lg shadow-primary-200/50"
                          : "hover:shadow-md"
                        }
                      `}
                      style={{
                        borderColor:
                          openType === option.value
                            ? theme.primary[400]
                            : theme.secondary[300],
                        backgroundColor:
                          openType === option.value
                            ? theme.primary[50]
                            : "white",
                        color:
                          openType === option.value
                            ? theme.primary[700]
                            : theme.secondary[600],
                      }}
                    >
                      <option.icon className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {option.label}
                      </span>
                      {openType === option.value && (
                        <motion.div
                          className="absolute inset-0 rounded-xl"
                          style={{
                            background: `linear-gradient(135deg, ${theme.primary[100]}, transparent)`,
                            opacity: 0.5,
                          }}
                          layoutId="activeTab"
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                        />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Button Toggle - Original Style */}
              <div className="mb-4">
                <label className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 cursor-pointer group hover:border-emerald-300 transition-colors">
                  <div className="flex items-center gap-3">
                    <div
                      className={`
                      w-10 h-6 flex items-center rounded-full p-1 transition-all
                      ${isButton
                          ? "bg-emerald-500 justify-end"
                          : "bg-gray-300 justify-start"
                        }
                    `}
                    >
                      <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Display as Button
                      </p>
                      <p className="text-xs text-gray-500">
                        Show link as a button instead of text
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isButton}
                    onChange={(e) => setIsButton(e.target.checked)}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Preview Section */}
              <div className="space-y-4">
                {getButtonPreview()}
                {getLinkPreview()}
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div
            className="flex flex-col sm:flex-row justify-end gap-3 px-6 pb-6 pt-5 border-t"
            style={{ borderColor: theme.secondary[200] }}
          >
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="
                px-5 py-3 rounded-xl text-sm font-semibold
                transition-all duration-300 cursor-pointer
                hover:shadow-md
              "
              style={{
                backgroundColor: theme.secondary[100],
                color: theme.secondary[700],
                border: `1px solid ${theme.secondary[300]}`,
              }}
            >
              Cancel
            </motion.button>

            <motion.button
              whileTap={{ scale: isFormValid ? 0.95 : 1 }}
              disabled={loading || !isFormValid}
              onClick={handleAdd}
              className={`
                px-6 py-3 rounded-xl text-sm font-semibold
                transition-all duration-300 relative overflow-hidden
                flex items-center justify-center min-w-[120px]
                ${!isFormValid
                  ? "cursor-not-allowed opacity-80"
                  : "cursor-pointer hover:shadow-xl active:shadow-lg"
                }
              `}
              style={{
                background: isFormValid
                  ? `linear-gradient(135deg, ${theme.primary[500]}, ${theme.primary[600]})`
                  : `linear-gradient(135deg, ${theme.primary[400]}, ${theme.primary[500]})`,
                color: "white",
                boxShadow: isFormValid
                  ? `0 4px 14px ${theme.primary[400]}40`
                  : "none",
              }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  {initialData ? 'Saving...' : 'Adding...'}
                </span>
              ) : (
                <>
                  <span>{initialData ? 'Save Changes' : 'Add Link'}</span>
                  {isFormValid && (
                    <motion.div
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background: `linear-gradient(135deg, transparent, ${theme.primary[400]}20, transparent)`,
                      }}
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  )}
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddLinkInTopicModal;
