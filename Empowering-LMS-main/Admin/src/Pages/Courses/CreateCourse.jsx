// CreateCourse.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlus,
  FaCheck,
  FaTimes,
  FaUpload,
  FaImage,
  FaEye,
  FaSpinner,
  FaArrowLeft,
  FaPalette,
  FaFileAlt,
  FaGlobe,
  FaCamera,
} from "react-icons/fa";
import axiosInstance from "../../../utils/axiosInstance";
import toast from "react-hot-toast";
import MediaPickerModal from "../../modules/media-files/MediaPickerModal";

const CreateCourse = () => {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    courseName: "",
    description: "",
    coverArt: "",
    isVisible: true,
  });

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // Media picker state
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [selectedCoverFile, setSelectedCoverFile] = useState(null);

  /* 🔥 HANDLE FORM INPUT CHANGES */
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* 🔥 HANDLE MEDIA SELECTION */
  const handleMediaSelect = (selectedFile) => {
    if (selectedFile) {
      setSelectedCoverFile(selectedFile);
      setFormData((prev) => ({
        ...prev,
        coverArt: selectedFile.src,
      }));
      toast.success("Cover image selected!");
    }
    setShowMediaPicker(false);
  };

  /* 🔥 HANDLE FORM SUBMISSION */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.courseName.trim()) {
      toast.error("Please enter a course name");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Please enter a course description");
      return;
    }

    if (!formData.coverArt) {
      toast.error("Please select a cover image");
      return;
    }

    try {
      setLoading(true);

      const response = await axiosInstance.post("/courses", {
        courseName: formData.courseName,
        description: formData.description,
        coverArt: formData.coverArt,
        isVisible: formData.isVisible,
      });

      if (response.data.success) {
        setShowSuccess(true);

        // Redirect after 2 seconds
        setTimeout(() => {
          navigate("/courses");
        }, 800);
      }
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error(error.response?.data?.message || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  /* 🔥 FORMAT FILE NAME */
  const formatFileName = (url) => {
    if (!url) return "No image selected";
    const name = url.split("/").pop();
    if (name.length > 30) {
      return name.substring(0, 15) + "..." + name.substring(name.length - 10);
    }
    return name;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50 p-4 md:p-6 w-full">
      <div className="max-w-400 mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate("courses")}
              className="p-2 hover:bg-teal-50 rounded-xl transition-colors duration-200 text-teal-600 hover:text-teal-700 cursor-pointer"
            >
              <FaArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Create New Course
              </h1>
              <p className="text-gray-600">
                Design your course with engaging content and visuals
              </p>
            </div>
          </div>
        </motion.div>

        {/* Mobile Layout - Image First */}
        <div className="block lg:hidden">
          <div className="space-y-8">
            {/* Cover Image Section - Mobile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-sm border border-teal-100 p-6"
            >
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FaPalette className="text-teal-500" />
                Cover Image *
              </label>

              {/* Clickable Cover Area */}
              <div
                onClick={() => setShowMediaPicker(true)}
                className="cursor-pointer group"
              >
                {formData.coverArt ? (
                  <div className="relative rounded-xl overflow-hidden border-2 border-teal-100 group-hover:border-teal-300 transition-all duration-300">
                    <img
                      src={formData.coverArt}
                      alt="Course cover"
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2">
                        <FaCamera className="text-teal-600" />
                        <span className="font-medium text-teal-700">
                          Change Image
                        </span>
                      </div>
                    </div>
                    <div className="absolute top-3 right-3 bg-teal-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Selected
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-64 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border-2 border-dashed border-teal-200 flex flex-col items-center justify-center text-gray-400 group-hover:border-teal-300 group-hover:bg-teal-100 transition-all duration-300">
                    <FaUpload className="w-12 h-12 mb-3 group-hover:text-teal-500 transition-colors" />
                    <p className="text-lg font-medium mb-1">
                      Click to upload cover image
                    </p>
                    <p className="text-sm">or select from media library</p>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-3 text-center">
                  {formData.coverArt
                    ? formatFileName(formData.coverArt)
                    : "Click to select or upload cover image"}
                </p>
              </div>
            </motion.div>

            {/* Form Section - Mobile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-teal-100 p-6"
            >
              <form onSubmit={handleSubmit}>
                {/* Course Name */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FaFileAlt className="text-teal-500" />
                    Course Name *
                  </label>
                  <input
                    type="text"
                    name="courseName"
                    value={formData.courseName}
                    onChange={handleInputChange}
                    placeholder="Enter a descriptive course title"
                    className="w-full px-4 py-3.5 bg-white border border-teal-100 rounded-xl focus:border-teal-300 focus:ring-3 focus:ring-teal-50 focus:outline-none transition-all duration-300 shadow-sm hover:border-teal-200 text-gray-700"
                    maxLength={100}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    {formData.courseName.length}/100 characters
                  </p>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FaFileAlt className="text-teal-500" />
                    Course Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe what students will learn in this course..."
                    className="w-full px-4 py-3.5 bg-white border border-teal-100 rounded-xl focus:border-teal-300 focus:ring-3 focus:ring-teal-50 focus:outline-none transition-all duration-300 shadow-sm hover:border-teal-200 text-gray-700 resize-none h-40"
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    {formData.description.length}/500 characters
                  </p>
                </div>

                {/* Visibility Toggle - Mobile */}
                <div className="mb-8">
                  <label className="flex items-center justify-between p-4 bg-teal-50 rounded-xl border border-teal-100 cursor-pointer group hover:bg-teal-100 transition-colors duration-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-teal-100 rounded-lg group-hover:bg-teal-200 transition-colors">
                        <FaGlobe className="text-teal-600" />
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">
                          Make course public
                        </span>
                        <p className="text-sm text-gray-500">
                          Course will be visible to all students
                        </p>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        name="isVisible"
                        checked={formData.isVisible}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div
                        className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                          formData.isVisible ? "bg-teal-500" : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                            formData.isVisible
                              ? "transform translate-x-7"
                              : "transform translate-x-1"
                          }`}
                        />
                      </div>
                    </div>
                  </label>
                </div>

                {/* Submit Button - Mobile */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-3.5 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Creating Course...
                    </>
                  ) : (
                    <>
                      <FaPlus />
                      Create Course
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-teal-100 p-6">
              <form onSubmit={handleSubmit}>
                {/* Course Name */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FaFileAlt className="text-teal-500" />
                    Course Name *
                  </label>
                  <input
                    type="text"
                    name="courseName"
                    value={formData.courseName}
                    onChange={handleInputChange}
                    placeholder="Enter a descriptive course title"
                    className="w-full px-4 py-3.5 bg-white border border-teal-100 rounded-xl focus:border-teal-300 focus:ring-3 focus:ring-teal-50 focus:outline-none transition-all duration-300 shadow-sm hover:border-teal-200 text-gray-700"
                    maxLength={100}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    {formData.courseName.length}/100 characters
                  </p>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FaFileAlt className="text-teal-500" />
                    Course Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe what students will learn in this course..."
                    className="w-full px-4 py-3.5 bg-white border border-teal-100 rounded-xl focus:border-teal-300 focus:ring-3 focus:ring-teal-50 focus:outline-none transition-all duration-300 shadow-sm hover:border-teal-200 text-gray-700 resize-none h-40"
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    {formData.description.length}/500 characters
                  </p>
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-3.5 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Creating Course...
                    </>
                  ) : (
                    <>
                      <FaPlus />
                      Create Course
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Right Column - Media Selection */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-teal-100 p-6 h-full">
              {/* Cover Image Section */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <FaPalette className="text-teal-500" />
                  Cover Image *
                </label>

                {/* Clickable Cover Area */}
                <div
                  onClick={() => setShowMediaPicker(true)}
                  className="cursor-pointer group mb-4"
                >
                  {formData.coverArt ? (
                    <div className="relative rounded-xl overflow-hidden border-2 border-teal-100 group-hover:border-teal-300 transition-all duration-300">
                      <img
                        src={formData.coverArt}
                        alt="Course cover"
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2">
                          <FaCamera className="text-teal-600" />
                          <span className="font-medium text-teal-700">
                            Change Image
                          </span>
                        </div>
                      </div>
                      <div className="absolute top-3 right-3 bg-teal-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Selected
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border-2 border-dashed border-teal-200 flex flex-col items-center justify-center text-gray-400 group-hover:border-teal-300 group-hover:bg-teal-100 transition-all duration-300">
                      <FaUpload className="w-12 h-12 mb-3 group-hover:text-teal-500 transition-colors" />
                      <p className="text-lg font-medium mb-1">
                        Click to upload cover image
                      </p>
                      <p className="text-sm">or select from media library</p>
                    </div>
                  )}
                </div>

                {/* File Info */}
                {formData.coverArt && (
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">
                      {selectedCoverFile?.name ||
                        formatFileName(formData.coverArt)}
                    </p>
                    <button
                      type="button"
                      onClick={() => setPreviewImage(formData.coverArt)}
                      className="text-xs text-teal-600 hover:text-teal-700 font-medium cursor-pointer hover:underline"
                    >
                      Preview Image
                    </button>
                  </div>
                )}

                <p className="text-xs text-gray-500 mt-3 text-center">
                  {formData.coverArt
                    ? "Click on the image to change it"
                    : "Click the upload area to select or upload cover image"}
                </p>
              </div>

              {/* Visibility Toggle */}
              <div className="pt-6 border-t border-teal-100">
                <label className="flex items-center justify-between p-4 bg-teal-50 rounded-xl border border-teal-100 cursor-pointer group hover:bg-teal-100 transition-colors duration-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-100 rounded-lg group-hover:bg-teal-200 transition-colors">
                      <FaGlobe className="text-teal-600" />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">
                        Make course public
                      </span>
                      <p className="text-sm text-gray-500">
                        Course will be visible to all students
                      </p>
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="isVisible"
                      checked={formData.isVisible}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div
                      className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                        formData.isVisible ? "bg-teal-500" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                          formData.isVisible
                            ? "transform translate-x-7"
                            : "transform translate-x-1"
                        }`}
                      />
                    </div>
                  </div>
                </label>
                <p className="text-xs text-gray-500 mt-3">
                  {formData.isVisible
                    ? "✓ This course will be visible to all students"
                    : "✗ This course will be hidden from students"}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Preview Modal */}
        <AnimatePresence>
          {previewImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
              onClick={() => setPreviewImage(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-6 max-w-4xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    Image Preview
                  </h3>
                  <button
                    onClick={() => setPreviewImage(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 cursor-pointer"
                  >
                    <FaTimes className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
                />
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setPreviewImage(null)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Media Picker Modal */}
        <MediaPickerModal
          isOpen={showMediaPicker}
          onClose={() => setShowMediaPicker(false)}
          onSelect={handleMediaSelect}
          allowedTypes="image"
          title="Select Cover Image"
          showUpload={true}
          multiSelect={false}
          preselectedFile={selectedCoverFile}
        />

        {/* Success Modal */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25 }}
                className="bg-white rounded-2xl p-8 text-center max-w-md"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="w-20 h-20 bg-gradient-to-r from-teal-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <FaCheck className="w-10 h-10 text-teal-600" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Course Created Successfully!
                </h3>
                <p className="text-gray-600 mb-6">
                  Your new course has been created and is ready for content.
                </p>
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2 }}
                    className="h-1 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full mb-4"
                  />
                  <div className="flex items-center gap-2 text-teal-600 mb-4">
                    <FaSpinner className="animate-spin" />
                    <span className="text-sm">Redirecting to courses...</span>
                  </div>
                  <button
                    onClick={() => navigate("courses")}
                    className="text-sm text-teal-600 hover:text-teal-700 font-medium cursor-pointer hover:underline"
                  >
                    Go to courses now
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CreateCourse;
