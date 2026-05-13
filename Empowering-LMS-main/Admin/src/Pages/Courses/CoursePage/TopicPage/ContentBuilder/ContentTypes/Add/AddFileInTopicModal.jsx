import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiFileText,
  FiX,
  FiFile,
  FiDownload,
  FiFilePlus,
  FiTrash2,
} from "react-icons/fi";
import {
  FaFilePdf,
  FaFileImage,
  FaFileVideo,
  FaFileAudio,
  FaFileArchive,
  FaFileWord,
  FaFileExcel,
} from "react-icons/fa";
import toast from "react-hot-toast";
import MediaPickerModal from "../../../../../../../modules/media-files/MediaPickerModal";
import useMediaPicker from "../../../../../../../modules/media-files/useMediaPicker";
import { IoMdCloseCircleOutline } from "react-icons/io";

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

const AddFileInTopicModal = ({ onClose, onAdd, loading, initialData }) => {
  const { isOpen, openMediaPicker, closeMediaPicker } = useMediaPicker();
  const [selectedFile, setSelectedFile] = useState(null);

  React.useEffect(() => {
    if (initialData) {
      setSelectedFile({
        src: initialData.src || initialData.url,
        name: initialData.name || "Existing File",
        size: initialData.size,
        type: initialData.type,
        mimeType: initialData.mimeType,
        extension: initialData.extension
      });
    }
  }, [initialData]);

  /* ================= OPEN MEDIA PICKER ================= */
  const handleOpenMediaPicker = async () => {
    try {
      const file = await openMediaPicker({
        allowedTypes: "all",
        title: "Select File",
        showUpload: true,
        multiSelect: false,
        preselectedFile: selectedFile
      });

      if (file) {
        setSelectedFile(file);
      }
    } catch (error) {
      console.error("Error selecting file:", error);
      toast.error("Failed to select file");
    }
  };

  /* ================= SUBMIT ================= */
  const handleAddFile = async () => {
    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }

    onAdd(selectedFile.src);
  };

  /* ================= GET FILE ICON ================= */
  const getFileIcon = (file) => {
    if (!file) return <FiFileText className="w-6 h-6 text-gray-400" />;

    const mimeType = file.mimeType || file.type;
    const extension =
      file.extension || file.name?.split(".").pop()?.toLowerCase();

    // Document types
    if (mimeType?.includes("pdf") || extension === "pdf") {
      return <FaFilePdf className="w-6 h-6 text-red-500" />;
    }
    if (
      mimeType?.includes("word") ||
      extension === "doc" ||
      extension === "docx"
    ) {
      return <FaFileWord className="w-6 h-6 text-blue-600" />;
    }
    if (
      mimeType?.includes("excel") ||
      extension === "xls" ||
      extension === "xlsx"
    ) {
      return <FaFileExcel className="w-6 h-6 text-green-600" />;
    }

    // Media types
    if (mimeType?.includes("image")) {
      return <FaFileImage className="w-6 h-6 text-emerald-500" />;
    }
    if (mimeType?.includes("video")) {
      return <FaFileVideo className="w-6 h-6 text-purple-500" />;
    }
    if (mimeType?.includes("audio")) {
      return <FaFileAudio className="w-6 h-6 text-amber-500" />;
    }
    if (
      mimeType?.includes("zip") ||
      mimeType?.includes("rar") ||
      mimeType?.includes("tar") ||
      mimeType?.includes("gzip")
    ) {
      return <FaFileArchive className="w-6 h-6 text-orange-500" />;
    }

    // Default file icon
    return <FiFileText className="w-6 h-6 text-gray-600" />;
  };

  /* ================= FORMAT FILE SIZE ================= */
  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  /* ================= GET FILE TYPE BADGE ================= */
  const getFileTypeBadge = (file) => {
    const extension =
      file.extension || file.name?.split(".").pop()?.toUpperCase();
    const mimeType = file.mimeType || file.type;

    if (!extension) return "File";

    if (mimeType?.includes("pdf")) return "PDF";
    if (mimeType?.includes("word")) return "DOC";
    if (mimeType?.includes("excel")) return "XLS";
    if (mimeType?.includes("image")) return "Image";
    if (mimeType?.includes("video")) return "Video";
    if (mimeType?.includes("audio")) return "Audio";
    if (mimeType?.includes("zip") || mimeType?.includes("rar"))
      return "Archive";

    return extension.toUpperCase();
  };

  return (
    <>
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 z-[60] bg-black/30 flex items-center justify-center px-2"
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
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg">
                  <FiFilePlus className="text-emerald-600 text-lg" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{initialData ? 'Edit File' : 'Add File'}</h3>
                  <p className="text-sm text-gray-500">
                    {initialData ? 'Update selected file' : 'Upload or select a file from your media library'}
                  </p>
                </div>
              </div>
            </div>

            {/* CONTENT */}
            <div className="p-6">
              {/* File Selection Area */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-600 mb-3">
                  Select File <span className="text-red-500">*</span>
                </label>

                {selectedFile ? (
                  <div className="border-2 border-emerald-500 rounded-xl overflow-hidden bg-gradient-to-br from-emerald-50/50 to-white">
                    <div className="p-5">
                      {/* File Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl">
                            {getFileIcon(selectedFile)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 truncate mb-1">
                              {selectedFile.name}
                            </h4>
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-md">
                                {getFileTypeBadge(selectedFile)}
                              </span>
                              {selectedFile.size && (
                                <span className="text-xs text-gray-500">
                                  {formatFileSize(selectedFile.size)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedFile(null)}
                          className="p-2 hover:bg-rose-50 text-rose-600 hover:text-rose-700 rounded-lg transition-colors cursor-pointer"
                          title="Remove file"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* File Details */}
                      <div className="border-t border-gray-200 pt-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Type</p>
                            <p className="text-sm font-medium text-gray-900">
                              {selectedFile.mimeType ||
                                selectedFile.type ||
                                "Unknown"}
                            </p>
                          </div>
                          {selectedFile.size && (
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Size</p>
                              <p className="text-sm font-medium text-gray-900">
                                {formatFileSize(selectedFile.size)}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* File URL Preview */}
                        {selectedFile.src && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <p className="text-xs text-gray-500 mb-1">
                              File URL
                            </p>
                            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                              <FiDownload className="w-4 h-4 text-gray-400" />
                              <p className="text-xs text-gray-600 truncate flex-1">
                                {selectedFile.src}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleOpenMediaPicker}
                    className="
                      w-full border-2 border-dashed border-gray-300 rounded-2xl p-10
                      text-center hover:bg-gray-50 hover:border-emerald-400 
                      transition-all duration-200 cursor-pointer group
                    "
                  >
                    <div className="w-16 h-16 mx-auto mb-5 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FiFile className="text-2xl text-emerald-600" />
                    </div>
                    <p className="font-medium text-gray-900 mb-2">
                      Select a File
                    </p>
                    <p className="text-sm text-gray-500 max-w-sm mx-auto">
                      Click to browse your media library or upload a new file
                    </p>
                    <div className="mt-4 flex items-center justify-center gap-6">
                      <span className="text-xs text-gray-400 px-3 py-1 bg-gray-100 rounded-full">
                        PDF, DOC, XLS
                      </span>
                      <span className="text-xs text-gray-400 px-3 py-1 bg-gray-100 rounded-full">
                        Images
                      </span>
                      <span className="text-xs text-gray-400 px-3 py-1 bg-gray-100 rounded-full">
                        Video
                      </span>
                    </div>
                  </button>
                )}

                {/* Supported Formats Info */}
                <div className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                  <p className="text-xs text-gray-500 mb-2">
                    📁 Supported Formats
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs px-2 py-1 bg-white text-gray-600 rounded-md">
                      PDF (.pdf)
                    </span>
                    <span className="text-xs px-2 py-1 bg-white text-gray-600 rounded-md">
                      Word (.doc, .docx)
                    </span>
                    <span className="text-xs px-2 py-1 bg-white text-gray-600 rounded-md">
                      Excel (.xls, .xlsx)
                    </span>
                    <span className="text-xs px-2 py-1 bg-white text-gray-600 rounded-md">
                      Images (.jpg, .png)
                    </span>
                    <span className="text-xs px-2 py-1 bg-white text-gray-600 rounded-md">
                      Video (.mp4, .mov)
                    </span>
                    <span className="text-xs px-2 py-1 bg-white text-gray-600 rounded-md">
                      Audio (.mp3, .wav)
                    </span>
                    <span className="text-xs px-2 py-1 bg-white text-gray-600 rounded-md">
                      ZIP (.zip, .rar)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="flex justify-end gap-3 px-6 pb-3 pt-4 border-t border-gray-200">
              <button
                onClick={onClose}
                className="
                  px-4 py-2 rounded-lg text-sm 
                  bg-gray-100 border border-gray-300 text-gray-600 
                  hover:bg-gray-200 transition cursor-pointer
                "
              >
                Cancel
              </button>

              <button
                disabled={loading || !selectedFile}
                onClick={handleAddFile}
                className="
                  px-5 py-2 rounded-lg text-sm font-medium
                  bg-emerald-500 hover:bg-emerald-600 text-white
                  transition disabled:opacity-50
                  flex items-center justify-center min-w-[110px] cursor-pointer
                "
              >
                ) : (
                initialData ? 'Save Changes' : 'Add File'
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* MEDIA PICKER MODAL - This needs higher z-index */}
      {isOpen && (
        <MediaPickerModal
          isOpen={isOpen}
          onClose={closeMediaPicker}
          onSelect={(file) => {
            setSelectedFile(file);
            closeMediaPicker();
          }}
          allowedTypes="all"
          title="Select File"
          showUpload={true}
          multiSelect={false}
        />
      )}
    </>
  );
};

export default AddFileInTopicModal;
