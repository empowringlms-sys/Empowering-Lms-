import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

const AddTextFieldInTopicModal = ({ onClose, onAdd, loading, initialData }) => {
    const [name, setName] = useState("");

    React.useEffect(() => {
        if (initialData) {
            setName(initialData.textName || initialData.text || initialData.title || "");
        }
    }, [initialData]);

    const handleSubmit = () => {
        if (!name.trim()) {
            toast.error("Please enter a name");
            return;
        }

        onAdd({ textName: name });
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
                    className="bg-white w-full max-w-xl rounded-2xl shadow-xl overflow-hidden"
                >
                    {/* HEADER */}
                    <div className="px-6 py-4 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800">{initialData ? 'Edit Text' : 'Add Text'}</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-700 text-xl transition"
                        >
                            ×
                        </button>
                    </div>

                    {/* BODY */}
                    <div className="px-6 pb-3 space-y-2">
                        <input
                            type="text"
                            placeholder="Eg. Instructions"
                            value={name}
                            autoFocus
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                            className="
                w-full rounded-xl border border-gray-200 
                px-4 py-3 text-sm
                focus:outline-none focus:ring-2 focus:ring-emerald-300
                transition mb-1
              "
                        />
                    </div>

                    {/* FOOTER */}
                    <div className="flex justify-end gap-3 px-6 pb-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg text-sm bg-gray-100 border border-gray-300 text-gray-600 hover:bg-gray-200 transition cursor-pointer"
                        >
                            Cancel
                        </button>

                        <button
                            disabled={loading}
                            onClick={handleSubmit}
                            className="
    px-5 py-2 rounded-lg text-sm font-medium
    bg-emerald-500 hover:bg-emerald-600 text-white
    transition disabled:opacity-50
    flex items-center justify-center min-w-[110px] cursor-pointer
  "
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                    {initialData ? 'Saving...' : 'Adding...'}
                                </span>
                            ) : (
                                initialData ? 'Save Changes' : 'Add Text'
                            )}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AddTextFieldInTopicModal;
