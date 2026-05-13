import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMedia } from "../MediaContext";
import { toast } from "react-hot-toast";
import MediaFilesPreviewModal from "./MediaFilesPreviewModal";
import {
  FiUpload,
  FiFile,
  FiImage,
  FiVideo,
  FiMusic,
  FiFileText,
  FiArchive,
  FiTrash2,
  FiEdit,
  FiDownload,
  FiEye,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiFolderPlus,
  FiX,
  FiCheck,
  FiCloud,
  FiChevronLeft,
  FiChevronRight,
  FiDatabase,
} from "react-icons/fi";

const MediaFiles = () => {
  const {
    mediaFiles,
    stats,
    loading,
    pagination,
    searchQuery,
    setSearchQuery,
    fetchFiles,
    uploadFile,
    uploadMultipleFiles,
    deleteFile,
    updateFileName,
    refreshData,
    initialLoadDone,
  } = useMedia();

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [selectedType, setSelectedType] = useState("all");
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const fileInputRef = useRef(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle drag events
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

    await handleFilesUpload(files);
  }, []);

  // Handle file selection
  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    await handleFilesUpload(files);
    e.target.value = "";
  };

  // Handle files upload
  const handleFilesUpload = async (files) => {
    setUploading(true);

    try {
      if (files.length === 1) {
        const toastId = toast.loading(`Uploading ${files[0].name}...`);
        const result = await uploadFile(files[0]);

        if (result.success) {
          toast.success(`${files[0].name} uploaded successfully!`, {
            id: toastId,
          });
        } else {
          toast.error(result.message || "Upload failed", { id: toastId });
        }
      } else {
        const toastId = toast.loading(`Uploading ${files.length} files...`);
        const result = await uploadMultipleFiles(files);

        if (result.success) {
          const successful = result.data?.successful?.length || 0;
          const failed = result.data?.failed?.length || 0;

          if (failed === 0) {
            toast.success(`All ${successful} files uploaded successfully!`, {
              id: toastId,
            });
          } else {
            toast.success(`Uploaded ${successful} files, ${failed} failed`, {
              id: toastId,
            });
          }
        } else {
          toast.error(result.message || "Upload failed", { id: toastId });
        }
      }
    } catch (error) {
      toast.error("Upload failed: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  // Handle file rename
  const handleRename = async (fileId, currentName) => {
    if (!editName.trim()) {
      toast.error("Please enter a file name");
      return;
    }

    const toastId = toast.loading("Updating file name...");
    const result = await updateFileName(fileId, editName);

    if (result.success) {
      toast.success("File name updated successfully!", { id: toastId });
      setEditingId(null);
      setEditName("");
    } else {
      toast.error(result.message || "Update failed", { id: toastId });
    }
  };

  // Handle file deletion
  const handleDelete = async () => {
    if (!confirmDelete) return;
    setIsDeleting(true);
    const toastId = toast.loading("Deleting file...");
    const result = await deleteFile(confirmDelete);
    setIsDeleting(false);
    if (result.success) {
      toast.success("File deleted successfully!", { id: toastId });
    } else {
      toast.error(result.message || "Delete failed", { id: toastId });
    }

    setConfirmDelete(null);
  };

  // Handle download
  const handleDownload = (url) => {
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success("Opened in new tab");
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  // Get file icon component
  const getFileIcon = (type) => {
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

  // Get file type color
  const getFileTypeColor = (type) => {
    switch (type) {
      case "image":
        return "text-blue-600 bg-blue-50 border-blue-100";
      case "video":
        return "text-purple-600 bg-purple-50 border-purple-100";
      case "document":
        return "text-emerald-600 bg-emerald-50 border-emerald-100";
      case "audio":
        return "text-amber-600 bg-amber-50 border-amber-100";
      case "archive":
        return "text-orange-600 bg-orange-50 border-orange-100";
      default:
        return "text-emerald-600 bg-emerald-50 border-emerald-100";
    }
  };

  // Filter files based on selected type
  const filteredFiles = mediaFiles.filter((file) => {
    if (selectedType === "all") return true;
    return file.type === selectedType;
  });

  // Statistics cards with beautiful design - Responsive sizing
  const statCards = [
    {
      type: "all",
      label: "All Files",
      icon: <FiDatabase className="text-lg md:text-xl" />,
      count: stats.total?.totalFiles || 0,
      gradient: "from-emerald-400 to-emerald-500",
      bg: "bg-gradient-to-r from-emerald-50 to-emerald-100",
    },
    {
      type: "image",
      label: "Images",
      icon: <FiImage className="text-lg md:text-xl" />,
      count: stats.byType?.find((s) => s.type === "image")?.count || 0,
      gradient: "from-blue-400 to-cyan-500",
      bg: "bg-gradient-to-r from-blue-50 to-cyan-100",
    },
    {
      type: "video",
      label: "Videos",
      icon: <FiVideo className="text-lg md:text-xl" />,
      count: stats.byType?.find((s) => s.type === "video")?.count || 0,
      gradient: "from-purple-400 to-pink-500",
      bg: "bg-gradient-to-r from-purple-50 to-pink-100",
    },
    {
      type: "document",
      label: "Documents",
      icon: <FiFileText className="text-lg md:text-xl" />,
      count: stats.byType?.find((s) => s.type === "document")?.count || 0,
      gradient: "from-emerald-400 to-green-500",
      bg: "bg-gradient-to-r from-emerald-50 to-green-100",
    },
    {
      type: "audio",
      label: "Audio",
      icon: <FiMusic className="text-lg md:text-xl" />,
      count: stats.byType?.find((s) => s.type === "audio")?.count || 0,
      gradient: "from-amber-400 to-yellow-500",
      bg: "bg-gradient-to-r from-amber-50 to-yellow-100",
    },
    {
      type: "archive",
      label: "Archives",
      icon: <FiArchive className="text-lg md:text-xl" />,
      count: stats.byType?.find((s) => s.type === "archive")?.count || 0,
      gradient: "from-orange-400 to-red-500",
      bg: "bg-gradient-to-r from-orange-50 to-red-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-50 to-emerald-50 sm:p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="max-w-400 mx-auto mb-6 sm:mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-emerald-50 to-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-emerald-100 shadow-sm"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 sm:gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <div className="p-1.5 sm:p-2 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-lg sm:rounded-xl">
                  <FiCloud className="text-lg sm:text-xl md:text-2xl text-white" />
                </div>
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-emerald-900">
                  Media Library
                </h1>
              </div>
              <p className="text-emerald-700/80 text-xs sm:text-sm md:text-base">
                Manage and organize all your digital files in one beautiful
                space
              </p>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 mt-3 lg:mt-0">
              {/* Refresh Button */}
              <button
                onClick={refreshData}
                disabled={loading}
                className="p-2 sm:p-3 bg-gradient-to-r from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 rounded-lg sm:rounded-xl transition-all duration-300 text-emerald-700 hover:text-emerald-900 cursor-pointer disabled:opacity-50 border border-emerald-200 hover:scale-105 shadow-sm flex items-center gap-1.5 sm:gap-2"
                title="Refresh files"
              >
                <FiRefreshCw
                  className={`w-4 h-4 sm:w-5 sm:h-5 ${
                    loading ? "animate-spin" : ""
                  }`}
                />
                <span className="text-xs sm:text-sm font-medium hidden sm:inline">
                  Refresh
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Statistics Cards - Responsive grid */}
      <div className="max-w-400 mx-auto mb-6 sm:mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-2 sm:gap-3 md:gap-4"
        >
          {statCards.map((stat) => {
            const isActive = selectedType === stat.type;
            const count = stat.count;

            if (stat.type !== "all" && count === 0) return null;

            return (
              <motion.div
                key={stat.type}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedType(stat.type)}
                className={`relative overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 cursor-pointer transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "ring-1 sm:ring-2 ring-emerald-400 shadow-md sm:shadow-lg"
                    : "hover:shadow-sm sm:hover:shadow-md hover:ring-1 hover:ring-emerald-300"
                } ${
                  stat.bg
                } border border-transparent hover:border-emerald-200`}
              >
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                  <div
                    className={`p-1.5 sm:p-2 md:p-3 rounded-lg sm:rounded-xl bg-white/80 shadow-sm`}
                  >
                    <div className={`text-${stat.gradient.split("-")[1]}-500`}>
                      {stat.icon}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                      {stat.label}
                    </p>
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mt-0.5 sm:mt-1">
                      {count}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Upload Section - Enhanced hover effects */}
      <div className="max-w-400 mx-auto mb-6 sm:mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className={`relative rounded-xl sm:rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer group ${
            dragOver
              ? "border-emerald-500 bg-emerald-50 scale-[1.01] sm:scale-[1.02] shadow-lg"
              : "border-emerald-300 hover:border-emerald-400 hover:bg-emerald-50/50 hover:shadow-xl"
          } bg-gradient-to-br from-white to-emerald-50/50 p-4 sm:p-6 md:p-8 lg:p-12`}
          onClick={handleFileSelect}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Animated background pattern on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(167,243,208,0.3),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(167,243,208,0.2),transparent_50%)]" />
          </div>

          <div className="relative text-center pointer-events-none">
            <motion.div
              animate={dragOver ? { y: [0, -5, 0] } : {}}
              transition={{ duration: 0.5, repeat: dragOver ? Infinity : 0 }}
              className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full mb-4 sm:mb-6 shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300"
            >
              <FiUpload className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white transition-transform duration-300" />
            </motion.div>

            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-emerald-900 mb-2 sm:mb-3 group-hover:scale-105 transition-transform duration-300">
              Drop your files here
            </h3>
            <p className="text-emerald-700/80 text-sm sm:text-base mb-4 sm:mb-6 max-w-md mx-auto group-hover:text-emerald-800 transition-colors duration-300">
              Drag & drop files to upload instantly, or click anywhere to browse
            </p>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              type="button"
              disabled={uploading}
              className="px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg sm:rounded-xl font-semibold hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto pointer-events-auto hover:scale-[1.05] shadow-md group-hover:shadow-2xl group-hover:from-emerald-600 group-hover:to-emerald-700"
              onClick={(e) => {
                e.stopPropagation();
                handleFileSelect();
              }}
            >
              {uploading ? (
                <>
                  <FiRefreshCw className="animate-spin w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">Uploading...</span>
                </>
              ) : (
                <>
                  <FiUpload className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">Browse Files</span>
                </>
              )}
            </button>

            <p className="text-xs sm:text-sm text-emerald-600/70 mt-4 sm:mt-6 group-hover:text-emerald-600 transition-colors duration-300">
              Supports images, videos, documents, audio, archives, and more
            </p>
          </div>
        </motion.div>
      </div>

      {/* Search and Filter Bar */}
      <div className="max-w-400 mx-auto mb-6 sm:mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-white to-emerald-50 rounded-xl sm:rounded-2xl shadow-sm p-3 sm:p-4 md:p-5 border border-emerald-100"
        >
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 items-stretch">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500 text-sm sm:text-base" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search files..."
                  className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 bg-white border border-emerald-200 rounded-lg sm:rounded-xl focus:border-emerald-400 focus:ring-2 sm:focus:ring-3 focus:ring-emerald-100 focus:outline-none transition-all duration-300 text-gray-700 placeholder-emerald-400/60 text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Filter Tabs - Horizontal scroll on mobile */}
            <div className="overflow-x-auto pb-2">
              <div className="flex gap-1.5 sm:gap-2 min-w-max">
                {statCards.map((stat) => {
                  if (stat.type === "all" || stat.count > 0) {
                    return (
                      <button
                        key={stat.type}
                        onClick={() => setSelectedType(stat.type)}
                        className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 flex items-center gap-1 sm:gap-2 whitespace-nowrap ${
                          selectedType === stat.type
                            ? "bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-800 border-1 sm:border-2 border-emerald-300 shadow-sm"
                            : "bg-white text-gray-700 border border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50/50"
                        }`}
                      >
                        <span className="text-xs sm:text-sm">{stat.icon}</span>
                        <span className="hidden xs:inline">{stat.label}</span>
                        {stat.type !== "all" && (
                          <span className="ml-0.5 px-1 py-0.5 text-xs rounded-full bg-emerald-100 text-emerald-700 font-bold">
                            {stat.count}
                          </span>
                        )}
                      </button>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-400 mx-auto">
        {loading && !initialLoadDone ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-2 border-b-2 border-emerald-500"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <FiCloud className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-500" />
              </div>
            </div>
            <p className="mt-4 sm:mt-6 text-emerald-700 font-medium text-base sm:text-lg">
              Loading your files...
            </p>
            <p className="text-xs sm:text-sm text-emerald-600/70 mt-1 sm:mt-2">
              Please wait a moment
            </p>
          </div>
        ) : filteredFiles.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 sm:py-20 bg-gradient-to-br from-white to-emerald-50 rounded-xl sm:rounded-2xl shadow-sm border border-emerald-100"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-r from-emerald-100 to-emerald-200 rounded-full mb-4 sm:mb-6">
              <FiFolderPlus className="text-2xl sm:text-3xl md:text-4xl text-emerald-600" />
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-emerald-900 mb-2 sm:mb-3">
              {searchQuery ? "No files found" : "No Files Yet"}
            </h3>
            <p className="text-emerald-700/80 text-sm sm:text-base max-w-md mx-auto px-4">
              {searchQuery
                ? `No files match "${searchQuery}". Try a different search term.`
                : selectedType !== "all"
                  ? `No ${selectedType} files found. Upload some to get started!`
                  : "Upload your first file to begin building your media library!"}
            </p>
            <button
              onClick={handleFileSelect}
              className="mt-6 sm:mt-8 px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg sm:rounded-xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center gap-2 mx-auto hover:scale-[1.02] shadow-md text-sm sm:text-base"
            >
              <FiUpload />
              Upload First File
            </button>
          </motion.div>
        ) : (
          <>
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-emerald-900">
                  {selectedType === "all"
                    ? "All Files"
                    : `${
                        selectedType.charAt(0).toUpperCase() +
                        selectedType.slice(1)
                      } Files`}
                </h2>
                <p className="text-emerald-700/80 text-sm sm:text-base">
                  {filteredFiles.length} file
                  {filteredFiles.length !== 1 ? "s" : ""} found
                </p>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-xs sm:text-sm text-emerald-700 font-medium">
                  Total:{" "}
                  {formatFileSize(
                    filteredFiles.reduce(
                      (sum, file) => sum + (file.size || 0),
                      0,
                    ),
                  )}
                </span>
              </div>
            </div>

            {/* Files List - Horizontal scroll only for table on mobile */}
            <div className="bg-gradient-to-br from-white to-emerald-50 rounded-xl sm:rounded-2xl shadow-sm border border-emerald-100 overflow-hidden mb-6 sm:mb-8 overflow-x-auto">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] sm:min-w-0 overflow-x-auto">
                  <thead>
                    <tr className="bg-gradient-to-r from-emerald-50 to-emerald-100">
                      <th className="p-3 sm:p-4 text-left text-emerald-800 font-semibold text-xs sm:text-sm">
                        File
                      </th>
                      <th className="p-3 sm:p-4 text-left text-emerald-800 font-semibold text-xs sm:text-sm">
                        Type
                      </th>
                      <th className="p-3 sm:p-4 text-left text-emerald-800 font-semibold text-xs sm:text-sm">
                        Size
                      </th>
                      <th className="p-3 sm:p-4 text-left text-emerald-800 font-semibold text-xs sm:text-sm">
                        Uploaded
                      </th>
                      <th className="p-3 sm:p-4 text-left text-emerald-800 font-semibold text-xs sm:text-sm">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFiles.map((file) => (
                      <tr
                        key={file._id}
                        className="border-t border-emerald-100 hover:bg-emerald-50/50 transition-colors cursor-pointer group"
                        onClick={(e) => {
                          // Only trigger preview if not clicking on action buttons
                          if (!e.target.closest("button")) {
                            setPreviewFile(file);
                          }
                        }}
                      >
                        <td className="p-3 sm:p-4">
                          <div className="flex items-center gap-3 sm:gap-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden shrink-0">
                              {file.type === "image" ? (
                                <img
                                  src={file.src}
                                  alt={file.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center">
                                  {getFileIcon(file.type)}
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              {editingId === file._id ? (
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) =>
                                      setEditName(e.target.value)
                                    }
                                    style={{ width: "15ch" }} 
                                    className="border border-emerald-300 rounded px-2 py-1.5 sm:px-3 sm:py-2 
                   text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500
                   whitespace-nowrap overflow-hidden"
                                    placeholder="Enter new name"
                                    autoFocus
                                  />
                                </div>
                              ) : (
                                <>
                                  <p className="font-medium text-gray-800 truncate text-sm sm:text-base">
                                    {(() => {
                                      const name = file.name.replace(
                                        /\.[^/.]+$/,
                                        "",
                                      );
                                      return name.length > 20
                                        ? name.slice(0, 15) + "…"
                                        : name;
                                    })()}
                                  </p>

                                  <p className="text-xs text-gray-500">
                                    .{file.name.split(".").pop()}
                                  </p>
                                </>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-3 sm:p-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-medium ${getFileTypeColor(
                              file.type,
                            )}`}
                          >
                            {getFileIcon(file.type)}
                            <span className="hidden xs:inline">
                              {file.type}
                            </span>
                          </span>
                        </td>
                        <td className="p-3 sm:p-4 text-emerald-700 font-medium text-xs sm:text-sm">
                          {formatFileSize(file.size)}
                        </td>
                        <td className="p-3 sm:p-4 text-emerald-700/80 text-xs sm:text-sm">
                          {new Date(file.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </td>
                        <td className="p-3 sm:p-4">
                          <div
                            className="flex gap-1 sm:gap-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => setPreviewFile(file)}
                              className="p-1.5 sm:p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors cursor-pointer"
                              title="Preview"
                            >
                              <FiEye className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleDownload(file.src, file.name)
                              }
                              className="p-1.5 sm:p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors cursor-pointer"
                              title="Download"
                            >
                              <FiDownload className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                            {editingId === file._id ? (
                              <>
                                <button
                                  onClick={() =>
                                    handleRename(file._id, file.name)
                                  }
                                  className="p-1.5 sm:p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors cursor-pointer"
                                  title="Save"
                                >
                                  <FiCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingId(null);
                                    setEditName("");
                                  }}
                                  className="p-1.5 sm:p-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                                  cursor-pointer
                                  title="Cancel"
                                >
                                  <FiX className="w-3 h-3 sm:w-4 sm:h-4" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => {
                                    setEditingId(file._id);
                                    setEditName(
                                      file.name.replace(/\.[^/.]+$/, ""),
                                    );
                                  }}
                                  className="p-1.5 sm:p-2 bg-amber-100 text-amber-600 rounded-lg hover:bg-amber-200 transition-colors cursor-pointer"
                                  title="Rename"
                                >
                                  <FiEdit className="w-3 h-3 sm:w-4 sm:h-4" />
                                </button>
                                <button
                                  onClick={() => setConfirmDelete(file._id)}
                                  className="p-1.5 sm:p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors cursor-pointer"
                                  title="Delete"
                                >
                                  <FiTrash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-6 sm:mb-8"
              >
                <button
                  onClick={() =>
                    fetchFiles(
                      pagination.page - 1,
                      selectedType === "all" ? null : selectedType,
                    )
                  }
                  disabled={pagination.page === 1}
                  className="cursor-pointer px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-white to-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg sm:rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-50 transition-colors flex items-center gap-1 sm:gap-2 hover:scale-105 text-xs sm:text-sm"
                >
                  <FiChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Previous</span>
                  <span className="sm:hidden">Prev</span>
                </button>

                {[...Array(Math.min(3, pagination.pages))].map((_, idx) => {
                  const pageNum = idx + 1;
                  if (pageNum <= pagination.pages) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() =>
                          fetchFiles(
                            pageNum,
                            selectedType === "all" ? null : selectedType,
                          )
                        }
                        className={`cursor-pointer px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl transition-all duration-300 text-xs sm:text-sm ${
                          pagination.page === pageNum
                            ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md scale-105"
                            : "bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                        } hover:scale-105`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  return null;
                })}

                {pagination.pages > 3 && (
                  <>
                    {pagination.page > 3 &&
                      pagination.page < pagination.pages - 1 && (
                        <span className="px-3 py-1.5 text-emerald-700">
                          ...
                        </span>
                      )}

                    {pagination.pages > 3 && (
                      <button
                        onClick={() =>
                          fetchFiles(
                            pagination.pages,
                            selectedType === "all" ? null : selectedType,
                          )
                        }
                        className={`cursor-pointer px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl transition-all duration-300 text-xs sm:text-sm ${
                          pagination.page === pagination.pages
                            ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md scale-105"
                            : "bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                        } hover:scale-105`}
                      >
                        {pagination.pages}
                      </button>
                    )}
                  </>
                )}

                <button
                  onClick={() =>
                    fetchFiles(
                      pagination.page + 1,
                      selectedType === "all" ? null : selectedType,
                    )
                  }
                  disabled={pagination.page === pagination.pages}
                  className="cursor-pointer px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-white to-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg sm:rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-50 transition-colors flex items-center gap-1 sm:gap-2 hover:scale-105 text-xs sm:text-sm"
                >
                  <span className="hidden sm:inline">Next</span>
                  <span className="sm:hidden">Next</span>
                  <FiChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setConfirmDelete(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-white  to-white rounded-xl sm:rounded-2xl p-4 sm:p-6 w-full max-w-md shadow-2xl border border-emerald-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="p-2 sm:p-3 bg-gradient-to-r from-red-100 to-orange-100 rounded-lg sm:rounded-xl">
                  <FiTrash2 className="text-xl sm:text-2xl text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-emerald-900">
                    Confirm Delete
                  </h3>
                  <p className="text-emerald-700/80 text-xs sm:text-sm mt-1">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <p className="text-emerald-700 text-sm sm:text-base mb-6 sm:mb-8">
                Are you sure you want to delete this file? This will permanently
                remove it from your media library.
              </p>

              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:from-emerald-100 hover:to-emerald-200 transition-all duration-300 border border-emerald-200 hover:scale-[1.02] text-sm sm:text-base cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base shadow-md transition-all duration-300 hover:shadow-xl hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isDeleting ? (
                    <>
                      <span className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    "Delete File"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Modal Component */}
      <AnimatePresence>
        {previewFile && (
          <MediaFilesPreviewModal
            file={previewFile}
            onClose={() => setPreviewFile(null)}
            onDownload={handleDownload}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MediaFiles;
