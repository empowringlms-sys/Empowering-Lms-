// components/MediaPickerModal.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUpload,
  FiFile,
  FiImage,
  FiVideo,
  FiMusic,
  FiFileText,
  FiArchive,
  FiX,
  FiCheck,
  FiSearch,
  FiRefreshCw,
  FiFolderPlus,
  FiEye,
  FiDownload,
  FiTrash2,
  FiCloud,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { useMedia } from "./MediaContext";

const MediaPickerModal = ({
  isOpen,
  onClose,
  onSelect,
  allowedTypes = "all",
  title = "Select Media",
  showUpload = true,
  multiSelect = false,
  preselectedFile = null,
}) => {
  const {
    mediaFiles = [],
    loading,
    searchQuery,
    setSearchQuery,
    fetchFiles,
    uploadFile,
    refreshData,
    initialLoadDone,
  } = useMedia();

  const [activeTab, setActiveTab] = useState("all");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const fileInputRef = useRef(null);

  // Determine which tabs to show based on allowedTypes
  const tabs = React.useMemo(() => {
    const allTabs = [
      {
        id: "all",
        label: "All Files",
        icon: <FiFile />,
        color: "text-emerald-600",
        bgColor: "bg-emerald-50",
      },
    ];

    const typeTabs = [
      {
        id: "image",
        label: "Images",
        icon: <FiImage />,
        color: "text-blue-500",
        bgColor: "bg-blue-50",
      },
      {
        id: "video",
        label: "Videos",
        icon: <FiVideo />,
        color: "text-purple-500",
        bgColor: "bg-purple-50",
      },
      {
        id: "document",
        label: "Documents",
        icon: <FiFileText />,
        color: "text-green-500",
        bgColor: "bg-green-50",
      },
      {
        id: "audio",
        label: "Audio",
        icon: <FiMusic />,
        color: "text-amber-500",
        bgColor: "bg-amber-50",
      },
      {
        id: "archive",
        label: "Archives",
        icon: <FiArchive />,
        color: "text-orange-500",
        bgColor: "bg-orange-50",
      },
    ];

    if (allowedTypes === "all") {
      return [...allTabs, ...typeTabs];
    }

    return [...allTabs, ...typeTabs.filter((tab) => tab.id === allowedTypes)];
  }, [allowedTypes]);

  // Filter files based on active tab and search
  const filteredFiles = React.useMemo(() => {
    if (!mediaFiles || !Array.isArray(mediaFiles)) {
      return [];
    }

    let filtered = [...mediaFiles];

    if (allowedTypes !== "all") {
      filtered = filtered.filter((file) => file?.type === allowedTypes);
    }

    if (activeTab !== "all") {
      filtered = filtered.filter((file) => file?.type === activeTab);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (file) =>
          file?.name?.toLowerCase().includes(query) ||
          (file?.extension && file.extension.toLowerCase().includes(query))
      );
    }

    return filtered.filter(Boolean);
  }, [mediaFiles, activeTab, searchQuery, allowedTypes]);

  // Get count of files for each tab
  const getTabFileCount = (tabId) => {
    if (!mediaFiles || !Array.isArray(mediaFiles)) return 0;

    let files = [...mediaFiles];

    if (allowedTypes !== "all" && allowedTypes !== tabId && tabId !== "all") {
      return 0;
    }

    if (tabId === "all") {
      if (allowedTypes !== "all") {
        files = files.filter((file) => file?.type === allowedTypes);
      }
    } else {
      files = files.filter((file) => file?.type === tabId);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      files = files.filter(
        (file) =>
          file?.name?.toLowerCase().includes(query) ||
          (file?.extension && file.extension.toLowerCase().includes(query))
      );
    }

    return files.length;
  };

  // Initialize data when modal opens
  useEffect(() => {
    if (isOpen && !initialLoadDone && fetchFiles) {
      fetchFiles();
    }
  }, [isOpen, initialLoadDone, fetchFiles]);

  // Reset and set preselected file when modal opens
  useEffect(() => {
    if (isOpen) {
      if (preselectedFile) {
        setSelectedFiles([preselectedFile]);
      } else {
        setSelectedFiles([]);
      }
      setActiveTab("all");
      if (setSearchQuery) {
        setSearchQuery("");
      }
    }
  }, [isOpen, preselectedFile, setSearchQuery]);

  // Get file icon with vibrant colors
  const getFileIcon = (type) => {
    if (!type) return <FiFile className="text-xl text-emerald-500" />;

    const iconClass = "text-xl";
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

  // Get file type from file object
  const getFileType = (file) => {
    if (!file?.type) return "other";

    if (file.type.startsWith("image/")) return "image";
    if (file.type.startsWith("video/")) return "video";
    if (file.type.startsWith("audio/")) return "audio";
    if (
      file.type === "application/pdf" ||
      file.type === "application/msword" ||
      file.type.includes("document")
    )
      return "document";
    if (
      file.type.includes("zip") ||
      file.type.includes("rar") ||
      file.type.includes("archive")
    )
      return "archive";
    return "other";
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  // Handle file selection
  const handleFileSelect = (file) => {
    // Robust check for ID
    if (!file) return;
    const fileId = file._id || file.id;
    if (!fileId) return;

    if (multiSelect) {
      setSelectedFiles((prev) => {
        const isSelected = prev.some((f) => (f?._id || f?.id) === fileId);
        if (isSelected) {
          return prev.filter((f) => (f?._id || f?.id) !== fileId);
        } else {
          return [...prev, file];
        }
      });
    } else {
      setSelectedFiles([file]);
    }
  };

  // Handle upload with progress simulation
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !uploadFile) return;

    if (allowedTypes !== "all") {
      const fileType = getFileType(file);
      if (fileType !== allowedTypes) {
        toast.error(`Only ${allowedTypes} files are allowed`);
        return;
      }
    }

    try {
      setIsUploadingFile(true);
      setUploading(true);
      setUploadProgress(0);

      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const result = await uploadFile(file);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result?.success) {
        setTimeout(() => {
          if (!multiSelect) {
            setSelectedFiles([result.data]);
          } else {
            setSelectedFiles((prev) => [...prev, result.data]);
          }
          toast.success("File uploaded successfully!");
        }, 300);
      }
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setTimeout(() => {
        setIsUploadingFile(false);
        setUploading(false);
        setUploadProgress(0);
      }, 500);
      e.target.value = "";
    }
  };

  // Handle drag and drop
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    const file = files[0];
    const input = { target: { files: [file] } };
    await handleUpload(input);
  }, []);

  // Handle insert
  const handleInsert = () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one file");
      return;
    }

    if (multiSelect) {
      onSelect(selectedFiles);
    } else {
      onSelect(selectedFiles[0]);
    }
    onClose();
  };

  // Render file preview with enhanced visual appeal
  const renderFilePreview = (file) => {
    if (!file) return null;

    if (file.type === "image") {
      return (
        <img
          src={file.src}
          alt={file.name || "File"}
          className="w-full h-full object-cover rounded-lg"
        />
      );
    }

    const bgGradients = {
      image: "from-blue-50 to-blue-100",
      video: "from-purple-50 to-purple-100",
      document: "from-emerald-50 to-emerald-100",
      audio: "from-amber-50 to-amber-100",
      archive: "from-orange-50 to-orange-100",
      other: "from-emerald-50 to-cyan-100",
    };

    return (
      <div
        className={`w-full h-full bg-gradient-to-br ${bgGradients[file.type] || bgGradients.other
          } rounded-lg flex flex-col items-center justify-center p-4`}
      >
        <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center mb-2 shadow-sm">
          {getFileIcon(file.type)}
        </div>
        <span className="text-xs font-medium text-gray-700 mt-2 truncate px-2">
          {file.extension?.toUpperCase() || "FILE"}
        </span>
      </div>
    );
  };

  // Render uploading overlay
  const renderUploadingOverlay = () => {
    if (!isUploadingFile) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center z-[100000]"
      >
        <div className="relative w-24 h-24 mb-4">
          <svg className="w-24 h-24" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#d1fae5"
              strokeWidth="8"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#10b981"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * uploadProgress) / 100}
              initial={{ strokeDashoffset: 283 }}
              animate={{ strokeDashoffset: 283 - (283 * uploadProgress) / 100 }}
              transition={{ duration: 0.3 }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <FiCloud className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>
        <p className="text-lg font-semibold text-gray-800 mb-2">
          Uploading File...
        </p>
        <p className="text-sm text-emerald-600 font-medium">
          {uploadProgress}% complete
        </p>
      </motion.div>
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-zinc-500/50 flex items-center justify-center z-[999999] p-2 sm:p-6 2xl:p-10"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
          className="bg-gradient-to-br from-white via-emerald-50/30 to-white rounded-2xl w-full max-w-380 flex flex-col h-[90vh] shadow-2xl border border-emerald-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between py-3 px-6 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-white rounded-t-2xl">
            <div>
              <h2 className="text-2xl font-bold text-emerald-900">{title}</h2>
              {/* <p className="text-emerald-600 text-sm mt-1 font-medium">
                {multiSelect ? "Select multiple files" : "Select a file"}
              </p> */}
            </div>
            <div className="flex items-center gap-3">
              {selectedFiles.length > 0 && (
                <span className="text-sm bg-emerald-100 text-emerald-800 font-semibold px-3 py-1 rounded-full">
                  {selectedFiles.length} selected
                </span>
              )}

              {/* Refresh Button moved to top-right corner */}
              <button
                onClick={() => refreshData && refreshData()}
                disabled={loading}
                className="p-2.5 bg-gradient-to-r from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 rounded-xl transition-all duration-300 text-emerald-700 hover:text-emerald-900 cursor-pointer disabled:opacity-50 shadow-sm border border-emerald-200 hover:scale-105"
                title="Refresh files"
              >
                <FiRefreshCw
                  className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
                />
              </button>

              <button
                onClick={onClose}
                className="p-2 hover:bg-emerald-100 rounded-xl transition-colors duration-200 text-emerald-700 hover:text-emerald-900 cursor-pointer"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
            {/* Left Sidebar - Tabs */}
            <div className="w-full md:w-64 border-r border-emerald-100 bg-gradient-to-b from-emerald-50 to-white p-5 overflow-y-auto">
              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500" />
                  <input
                    type="text"
                    value={searchQuery || ""}
                    onChange={(e) =>
                      setSearchQuery && setSearchQuery(e.target.value)
                    }
                    placeholder="Search files..."
                    className="w-full pl-10 pr-4 py-3 bg-white border border-emerald-200 rounded-xl focus:border-emerald-400 focus:ring-3 focus:ring-emerald-100 focus:outline-none transition-all duration-300 text-gray-700 placeholder-emerald-400/60"
                  />
                </div>
              </div>

              {/* Tabs */}
              <div className="space-y-2 mb-6">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  const fileCount = getTabFileCount(tab.id);

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02] ${isActive
                          ? "bg-gradient-to-r from-emerald-50 to-emerald-100 border-2 border-emerald-300 text-emerald-800 shadow-sm"
                          : "hover:bg-emerald-50/70 text-gray-700 border border-transparent hover:border-emerald-200"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`${tab.color} bg-white p-2 rounded-lg shadow-sm`}
                        >
                          {tab.icon}
                        </span>
                        <span className="font-semibold">{tab.label}</span>
                      </div>

                      {/* Beautiful file count badge */}
                      {fileCount > 0 && (
                        <div
                          className={`
                          flex items-center justify-center min-w-8 h-8 rounded-full text-xs font-bold
                          ${isActive
                              ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md"
                              : "bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800"
                            }
                        `}
                        >
                          {fileCount > 99 ? "99+" : fileCount}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Upload Section */}
              {showUpload && (
                <div
                  className={`border-2 border-dashed rounded-xl p-5 text-center transition-all duration-300 cursor-pointer relative overflow-hidden min-h-[180px] flex flex-col items-center justify-center  ${dragOver
                      ? "border-emerald-500 bg-emerald-50 scale-[1.02] shadow-lg"
                      : "border-emerald-300 hover:border-emerald-400 hover:bg-emerald-50/80"
                    }
                    ${uploading ? "pointer-events-none" : ""}
                  `}
                  onClick={() => !uploading && fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {renderUploadingOverlay()}
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full mb-3 shadow-md">
                    <FiUpload className="text-xl text-white" />
                  </div>
                  <p className="text-sm font-semibold text-emerald-800 mb-1">
                    Upload New File
                  </p>
                  <p className="text-xs text-emerald-600/80">
                    Drag & drop or click to browse
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleUpload}
                    className="hidden"
                    accept={
                      allowedTypes === "image"
                        ? "image/*"
                        : allowedTypes === "video"
                          ? "video/*"
                          : allowedTypes === "audio"
                            ? "audio/*"
                            : allowedTypes === "document"
                              ? ".pdf,.doc,.docx,.txt"
                              : allowedTypes === "archive"
                                ? ".zip,.rar,.7z"
                                : "*/*"
                    }
                  />
                </div>
              )}
            </div>

            {/* Right Content - Files Grid */}
            <div className="flex-1 flex flex-col overflow-hidden min-h-0">
              {/* Files Grid */}
              <div className="flex-1 overflow-y-auto p-5 min-h-0 bg-white">
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
                    <p className="text-emerald-700 font-medium">
                      Loading files...
                    </p>
                    <p className="text-sm text-emerald-600/70 mt-1">
                      Please wait
                    </p>
                  </div>
                ) : filteredFiles.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-emerald-600/50 py-12">
                    <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                      <FiFolderPlus className="w-10 h-10 text-emerald-500" />
                    </div>
                    <p className="text-lg font-semibold text-emerald-800">
                      No files found
                    </p>
                    <p className="text-sm text-emerald-600/70 mt-2 text-center px-4">
                      {searchQuery
                        ? "Try a different search term"
                        : showUpload
                          ? "Upload your first file to get started"
                          : "No files available"}
                    </p>
                  </div>
                ) : (
                  <div className="columns-[160px] gap-4">
                    {filteredFiles.map((file) => {
                      const isSelected = selectedFiles.some(
                        (f) => (f?._id || f?.id) === (file?._id || file?.id)
                      );

                      return (
                        <motion.div
                          key={file?._id || file?.id}
                          className="mb-4 break-inside-avoid cursor-pointer"
                          whileHover={{ y: -4 }}
                          onClick={() => handleFileSelect(file)}
                        >
                          <div
                            className={`relative bg-white rounded-xl border-2 overflow-hidden shadow-sm transition-all ${isSelected
                                ? "border-emerald-500 ring-4 ring-emerald-100"
                                : "border-emerald-100 hover:border-emerald-300"
                              }`}
                          >
                            {renderFilePreview(file)}

                            {isSelected && (
                              <div className="absolute top-3 right-3 w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                                <FiCheck className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer - Actions */}
          <div className="py-3 px-4 pl-5 border-t border-emerald-100 bg-gradient-to-r from-white to-emerald-50/30 flex items-center justify-between rounded-b-2xl">
            <div className="text-sm text-emerald-700">
              {multiSelect ? (
                <span className="font-medium">
                  {selectedFiles.length} file
                  {selectedFiles.length !== 1 ? "s" : ""} selected
                </span>
              ) : (
                <span className="font-medium">
                  {selectedFiles.length > 0 && selectedFiles[0]?.name
                    ? `Selected: ${selectedFiles[0].name}`
                    : "No file selected"}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-md font-semibold hover:bg-emerald-200 transition-all duration-200 cursor-pointer hover:shadow-sm border border-emerald-200"
              >
                Cancel
              </button>
              <button
                onClick={handleInsert}
                disabled={selectedFiles.length === 0}
                className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-md font-semibold hover:shadow-lg transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:scale-[1.02] shadow-md"
              >
                <FiCheck className="w-4 h-4" />
                {multiSelect
                  ? `Insert ${selectedFiles.length} File${selectedFiles.length !== 1 ? "s" : ""
                  }`
                  : `Insert File`}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MediaPickerModal;
