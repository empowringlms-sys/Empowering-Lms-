import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FiX, FiSave, FiAlertCircle, FiAlertTriangle } from "react-icons/fi";
import toast from "react-hot-toast";

export default function SlugEditModal({ isOpen, onClose, currentSlug, updateProfile }) {
    const [slug, setSlug] = useState(currentSlug || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isOpen) {
            setSlug(currentSlug || "");
            setError("");
        }
    }, [isOpen, currentSlug]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Basic validation
        if (!slug.trim()) {
            setError("Slug cannot be empty");
            return;
        }

        const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
        if (!slugRegex.test(slug)) {
            setError("Invalid format. Use lowercase alphanumeric and hyphens only.");
            return;
        }

        if (slug === currentSlug) {
            onClose();
            return;
        }

        setLoading(true);
        try {
            const res = await updateProfile({ slug });
            if (res.success) {
                toast.success("Learner Panel Link updated!");
                onClose();
            } else {
                setError(res.message || "Failed to update slug");
            }
        } catch (err) {
            console.error(err);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all border border-gray-100">
                <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="text-lg font-bold text-gray-800">Edit Learner Link</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100">
                        <FiX size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    {/* Warning Alert */}
                    <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 text-amber-800">

                        <div className="text-sm">
                            <p className="font-semibold mb-1">
                                <FiAlertTriangle className="flex-shrink-0 text-xl mt-0.5 inline-block mr-2" />Important Warning</p>
                            <p className="opacity-90 leading-relaxed">
                                Changing your learner link will <strong>invalidate</strong> the old link.
                                All your learners will need to use the new link to access their accounts. Old links will stop working immediately.
                            </p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Learner Panel Slug
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={slug}
                                onChange={(e) => {
                                    setSlug(e.target.value);
                                    setError("");
                                }}
                                className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all font-mono text-sm ${error ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "border-gray-200 focus:border-emerald-500"
                                    }`}
                                placeholder="company-name"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                            <span className="bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 font-mono">learner.com/{slug}</span>
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                            <FiAlertCircle />
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium border border-transparent hover:border-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed font-medium shadow-sm hover:shadow active:scale-95 transform duration-150"
                        >
                            {loading ? (
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <FiSave />
                            )}
                            Confirm Change
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}
