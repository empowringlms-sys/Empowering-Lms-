import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { FiX } from "react-icons/fi";

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

const isValidGoogleDoc = (url) =>
  /^https:\/\/docs\.google\.com\/(document|spreadsheets|presentation)\//.test(
    url
  );

const toEmbedUrl = (url) => {
  if (url.includes("/edit")) return url.replace("/edit", "/preview");
  return url + "/preview";
};

const AddGoogleDocInTopicModal = ({ onClose, onAdd, initialData }) => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (initialData) {
      if (initialData.title) setTitle(initialData.title);
      if (initialData.description) setDesc(initialData.description);
      if (initialData.src) {
        // Convert to editable URL for the input if possible, or just show preview URL
        // Typically we store embed URL ending in /preview
        if (initialData.src.includes("/preview")) {
          // Attempt to show the "edit" or standard link in the input for user convenience
          // though technically both work for our regex check if we adjust regex or logic
          setUrl(initialData.src.replace("/preview", "/edit"));
        } else {
          setUrl(initialData.src);
        }
      }
    }
  }, [initialData]);

  const handleAdd = async () => {
    if (!title.trim()) {
      toast.error("Document name required");
      return;
    }

    if (!isValidGoogleDoc(url)) {
      toast.error("Only Google Docs / Sheets / Slides links allowed");
      return;
    }

    setLoading(true);
    await onAdd({
      title,
      description: desc,
      src: toEmbedUrl(url),
    });
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAdd();
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
          <div className="px-6 py-4 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">{initialData ? 'Edit Google Doc' : 'Insert Google Doc'}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 text-xl transition cursor-pointer"
            >
              <FiX size={24} />
            </button>
          </div>

          {/* BODY */}
          <div className="px-6 pb-3 space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">
                Document Name
              </label>
              <input
                type="text"
                placeholder="E.g. Group Work"
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

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">
                Description
              </label>
              <textarea
                rows={3}
                placeholder="Optional description"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="
                  w-full rounded-xl border border-gray-200 
                  px-4 py-3 text-sm resize-none
                  focus:outline-none focus:ring-2 focus:ring-emerald-300
                  transition
                "
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">
                Document URL
              </label>
              <input
                type="text"
                placeholder="https://docs.google.com/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={handleKeyDown}
                className="
                  w-full rounded-xl border border-gray-200 
                  px-4 py-3 text-sm
                  focus:outline-none focus:ring-2 focus:ring-emerald-300
                  transition
                "
              />
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-3 px-6 pb-6">
            <button
              onClick={onClose}
              className="
                px-4 py-2 rounded-lg text-sm 
                bg-gray-100 border border-gray-300 
                text-gray-600 hover:bg-gray-200 
                transition cursor-pointer
              "
            >
              Cancel
            </button>

            <button
              disabled={loading}
              onClick={handleAdd}
              className="
                px-5 py-2 rounded-lg text-sm font-medium
                bg-emerald-500 hover:bg-emerald-600 text-white
                transition disabled:opacity-50
                flex items-center justify-center min-w-[150px] cursor-pointer
              "
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  {initialData ? 'Saving...' : 'Adding...'}
                </span>
              ) : (
                initialData ? 'Save Changes' : 'Insert Google Doc'
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddGoogleDocInTopicModal;
