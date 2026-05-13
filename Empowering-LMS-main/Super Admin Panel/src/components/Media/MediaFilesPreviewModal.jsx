import React from "react";
import { motion } from "framer-motion";
import { FiX, FiDownload, FiEye, FiMusic, FiImage, FiVideo, FiFileText, FiArchive, FiFile } from "react-icons/fi";

const MediaFilesPreviewModal = ({ file, onClose, onDownload }) => {
    if (!file) return null;

    const getFileIcon = (type) => {
        const iconClass = "text-2xl";
        switch (type) {
            case "image":
                return <FiImage className={`${iconClass} text-blue-500`} />;
            case "video":
                return <FiVideo className={`${iconClass} text-purple-500`} />;
            case "document":
                return <FiFileText className={`${iconClass} text-emerald-500`} />;
            case "audio":
                return <FiMusic className={`${iconClass} text-amber-500`} />;
            case "archive":
                return <FiArchive className={`${iconClass} text-orange-500`} />;
            default:
                return <FiFile className={`${iconClass} text-emerald-500`} />;
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[1000000] p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative bg-black/90 rounded-2xl overflow-hidden max-w-7xl w-full max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                >
                    <FiX className="w-6 h-6" />
                </button>

                {/* Header */}
                <div className="p-6 bg-gradient-to-r from-black/80 to-black/60 text-white shrink-0">
                    <div className="flex items-center gap-3 mb-2">
                        {getFileIcon(file.type)}
                        <h3 className="text-xl font-semibold truncate">
                            {file.name}
                        </h3>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                        <span>Type: {file.type}</span>
                        <span>Size: {formatFileSize(file.size)}</span>
                        <span>
                            Uploaded: {new Date(file.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                {/* Media Display with Scroll */}
                <div className="flex-1 overflow-auto p-4 md:p-8">
                    {file.type === "image" ? (
                        <div className="flex justify-center h-full">
                            <img
                                src={file.src}
                                alt={file.name}
                                className="max-w-full max-h-full object-contain"
                            />
                        </div>
                    ) : file.type === "video" ? (
                        <div className="flex justify-center h-full">
                            <video
                                src={file.src}
                                controls
                                autoPlay
                                className="max-w-full max-h-full rounded-lg"
                            />
                        </div>
                    ) : file.type === "audio" ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="bg-gradient-to-r from-emerald-900/20 to-emerald-800/20 rounded-2xl p-8 md:p-12 w-full max-w-md">
                                <div className="flex flex-col items-center gap-6">
                                    <div className="p-6 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full">
                                        <FiMusic className="text-4xl text-white" />
                                    </div>
                                    <audio src={file.src} controls autoPlay className="w-full" />
                                    <p className="text-white text-lg font-medium text-center">
                                        Playing: {file.name}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center items-center h-full">
                            <div className="bg-gradient-to-r from-emerald-900/20 to-emerald-800/20 rounded-2xl p-8 md:p-12 w-full max-w-md">
                                <div className="flex flex-col items-center gap-6">
                                    <div className="p-6 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full">
                                        {getFileIcon(file.type)}
                                    </div>
                                    <p className="text-white text-xl font-semibold text-center">
                                        {file.name}
                                    </p>
                                    <p className="text-emerald-300 text-center">
                                        This file type cannot be previewed
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-6 bg-gradient-to-r from-black/80 to-black/60 flex flex-wrap justify-center gap-3 shrink-0">
                    <button
                        onClick={() => onDownload(file.src, file.name)}
                        className="px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center gap-2 hover:scale-[1.02] shadow-md text-sm md:text-base"
                    >
                        <FiDownload className="w-4 h-4 md:w-5 md:h-5" />
                        Download
                    </button>
                    {file.type === "image" && (
                        <a
                            href={file.src}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center gap-2 hover:scale-[1.02] shadow-md text-sm md:text-base"
                        >
                            <FiEye className="w-4 h-4 md:w-5 md:h-5" />
                            Open in New Tab
                        </a>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default MediaFilesPreviewModal;
