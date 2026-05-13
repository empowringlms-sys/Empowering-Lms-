import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiBook,
  FiClock,
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
  FiEdit2,
  FiArrowLeft,
  FiSave,
  FiX,
  FiActivity,
  FiShield,
  FiInfo,
  FiKey,
  FiMoreVertical,
  FiShieldOff,
} from "react-icons/fi";
import toast from "react-hot-toast";
import axiosInstance from "../../../../utils/axiosInstance";

import useMediaPicker from "../../../modules/media-files/useMediaPicker";
import MediaPickerModal from "../../../modules/media-files/MediaPickerModal";
import { FaUser } from "react-icons/fa";

const LearnerPage = () => {
  const { learnerId } = useParams();
  const navigate = useNavigate();
  const [learner, setLearner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    contactNo: "",
    isVerified: false,
    avatar: "",
  });
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const { isOpen: isMediaOpen, openMediaPicker, closeMediaPicker, config: mediaConfig } = useMediaPicker();

  // Fetch learner data
  useEffect(() => {
    const fetchLearnerData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/users/${learnerId}`);

        if (response?.data?.success) {
          setLearner(response.data.data.learner);
          setEditForm({
            name: response.data.data.learner.name,
            email: response.data.data.learner.email,
            contactNo: response.data.data.learner.contactNo,
            isVerified: response.data.data.learner.isVerified,
            avatar: response.data.data.learner.avatar || "",
          });
        } else {
          throw new Error("Failed to fetch learner data");
        }
      } catch (error) {
        console.error("Error fetching learner:", error);
        toast.error("Failed to load learner details");
        navigate("/learners");
      } finally {
        setLoading(false);
      }
    };

    if (learnerId) {
      fetchLearnerData();
    }
  }, [learnerId, navigate]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAvatarChange = async () => {
    try {
      const result = await openMediaPicker({
        allowedTypes: "image",
        title: "Select Profile Picture",
        multiSelect: false,
      });

      if (result) {
        setEditForm(prev => ({ ...prev, avatar: result.src || result.url }));
      }
    } catch (e) {
      // cancelled
    }
  };

  // Handle save changes
  const handleSaveChanges = async () => {
    try {
      setUpdating(true);

      const payload = {
        name: editForm.name,
        email: editForm.email,
        isVerified: editForm.isVerified,
        avatar: editForm.avatar,
        contactNo: editForm.contactNo,
      };

      const response = await axiosInstance.put(`/users/${learnerId}`, payload);

      if (response?.data?.success) {
        // Update the local state with the formatted response
        const updatedLearner = response.data.data.learner;
        setLearner(updatedLearner);

        // Also update the editForm with the latest data
        setEditForm({
          name: updatedLearner.name,
          email: updatedLearner.email,
          contactNo: updatedLearner.contactNo,
          isVerified: updatedLearner.isVerified,
          avatar: updatedLearner.avatar || "",
        });

        setIsEditing(false);
        toast.success("Learner updated successfully");
      }
    } catch (error) {
      console.error("Error updating learner:", error);
      toast.error("Failed to update learner");
    } finally {
      setUpdating(false);
    }
  };
  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditForm({
      name: learner.name,
      email: learner.email,
      contactNo: learner.contactNo,
      isVerified: learner.isVerified,
      avatar: learner.avatar || "",
    });
    setIsEditing(false);
  };

  // Get initial letters for avatar
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Format date for mobile
  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate time ago
  const getTimeAgo = (dateString) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
  };

  // Mobile menu actions
  // Mobile menu actions removed
  const mobileActions = [];



  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50/30 to-white p-3 sm:p-4 md:p-6">
        <div className="max-w-[1600px] mx-auto">
          {/* Mobile Loading Skeleton */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4 sm:space-y-6"
          >
            {/* Header Skeleton - Mobile */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-emerald-200 animate-pulse"></div>
              <div className="flex-1">
                <div className="w-32 h-5 sm:w-48 sm:h-6 bg-emerald-200 rounded animate-pulse mb-2"></div>
                <div className="w-24 h-3 sm:w-32 sm:h-4 bg-emerald-100 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Profile Card Skeleton - Mobile */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-emerald-100 p-4 sm:p-6 animate-pulse">
              <div className="flex items-center gap-4 sm:gap-6 mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-emerald-200"></div>
                <div className="flex-1">
                  <div className="w-40 h-6 sm:w-56 sm:h-7 md:w-64 md:h-8 bg-emerald-200 rounded mb-3"></div>
                  <div className="w-24 h-4 sm:w-28 sm:h-5 md:w-32 md:h-6 bg-emerald-100 rounded mb-2"></div>
                  <div className="w-36 h-3 sm:w-44 sm:h-4 bg-emerald-100 rounded"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!learner) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50/30 to-white p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center max-w-xs sm:max-w-sm">
          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center mx-auto mb-4">
            <FiUser className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-emerald-500" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-emerald-900 mb-2">
            Learner Not Found
          </h3>
          <p className="text-emerald-600 text-sm sm:text-base mb-6">
            The requested learner could not be found.
          </p>
          <button
            onClick={() => navigate("/learners")}
            className="px-4 py-2.5 sm:px-5 sm:py-3 md:px-6 md:py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300 active:scale-95 cursor-pointer"
          >
            Back to Learners
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/30 to-white p-3 sm:p-4 md:p-6">
      <MediaPickerModal
        isOpen={isMediaOpen}
        onClose={closeMediaPicker}
        onSelect={mediaConfig.onSelect}
        allowedTypes={mediaConfig.allowedTypes}
        title={mediaConfig.title}
        multiSelect={mediaConfig.multiSelect}
      />
      <div className="max-w-[1600px] mx-auto">
        {/* Mobile Header - Sticky */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="sticky top-0 z-40  mb-4 sm:mb-6 md:mb-8 pt-2 pb-3 sm:pt-0 sm:pb-0 sm:relative"
        >
          <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-start sm:gap-4 md:flex-row md:items-center md:justify-between">
            {/* Left side - Back button and title */}
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
              <button
                onClick={() => navigate("/learners")}
                className="flex items-center justify-center w-10 h-10 sm:w-auto sm:h-auto sm:px-3 sm:py-2.5 bg-emerald-50 text-emerald-700 font-medium rounded-xl hover:bg-emerald-100 active:scale-95 transition-all duration-200 cursor-pointer flex-shrink-0"
                aria-label="Back to learners"
              >
                <FiArrowLeft className="w-5 h-5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline ml-2">Back</span>
              </button>

              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-emerald-900 truncate">
                  Learner Details
                </h1>
                {/* <p className="text-xs sm:text-sm text-emerald-600 truncate">
                  {learner.name}
                </p> */}
              </div>
            </div>

            {/* Right side - Edit/Save buttons */}
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <>
                  {/* Mobile menu button */}
                  <button
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                    className="sm:hidden flex items-center justify-center w-10 h-10 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 active:scale-95 transition-all duration-200 cursor-pointer"
                    aria-label="More actions"
                  >
                    <FiMoreVertical className="w-5 h-5" />
                  </button>

                  {/* Edit button */}
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 sm:px-4 sm:py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-xl hover:shadow-lg active:scale-95 transition-all duration-300 cursor-pointer"
                  >
                    <FiEdit2 className="w-4 h-4 sm:w-4 sm:h-4" />
                    <span className="text-sm sm:text-base">Edit</span>
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCancelEdit}
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 sm:px-4 sm:py-3 bg-rose-50 text-rose-700 font-medium rounded-xl hover:bg-rose-100 active:scale-95 transition-all duration-200 cursor-pointer"
                  >
                    <FiX className="w-4 h-4" />
                    <span className="text-sm sm:text-base hidden sm:inline">
                      Cancel
                    </span>
                  </button>
                  <button
                    onClick={handleSaveChanges}
                    disabled={updating}
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 sm:px-4 sm:py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-xl hover:shadow-lg active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <FiSave
                      className={`w-4 h-4 ${updating ? "animate-spin" : ""}`}
                    />
                    <span className="text-sm sm:text-base">
                      {updating ? "Saving..." : "Save"}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Mobile Actions Menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="sm:hidden mb-4"
            >
              <div className="bg-white rounded-xl border border-emerald-100 shadow-lg p-3">
                <div className="space-y-2">
                  {mobileActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        action.action();
                        setShowMobileMenu(false);
                      }}
                      className="w-full flex items-center justify-between p-3 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 active:scale-95 transition-all duration-200 cursor-pointer"
                    >
                      <span className="text-sm font-medium">
                        {action.label}
                      </span>
                      <action.icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content - Stack on mobile, grid on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {/* Left Column - Profile Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-4 sm:space-y-5 md:space-y-6"
          >
            {/* Profile Card */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
              <div className="p-4 sm:p-5 md:p-6">
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5 md:gap-6">
                  {/* Avatar */}
                  <div className="relative self-center sm:self-start">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-2xl sm:text-3xl md:text-4xl font-bold shadow-md border-4 border-emerald-50">
                      {isEditing && (
                        <div
                          className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer z-10"
                          onClick={handleAvatarChange}
                        >
                          <FiEdit2 className="w-8 h-8 text-white" />
                        </div>
                      )}
                      {(isEditing ? editForm.avatar : learner.avatar) ? (
                        <img
                          src={isEditing ? editForm.avatar : learner.avatar}
                          alt={learner.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FaUser className="w-1/2 h-1/2 text-white" />
                      )}
                    </div>
                    <div
                      className={`absolute bottom-1 right-1 sm:bottom-2 sm:right-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-white ${learner.isVerified ? "bg-emerald-500" : "bg-amber-500"
                        }`}
                    />
                  </div>

                  {/* Profile Info */}
                  <div className="flex-1 w-full">
                    {isEditing ? (
                      <div className="space-y-3 sm:space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-emerald-900 mb-1.5">
                            Full Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={editForm.name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white border border-emerald-200 rounded-xl focus:border-emerald-400 focus:ring-2 sm:focus:ring-3 focus:ring-emerald-100 focus:outline-none transition-all duration-300 text-emerald-900 text-base sm:text-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-emerald-900 mb-1.5">
                            Email Address
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={editForm.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white border border-emerald-200 rounded-xl focus:border-emerald-400 focus:ring-2 sm:focus:ring-3 focus:ring-emerald-100 focus:outline-none transition-all duration-300 text-emerald-900 text-base sm:text-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-emerald-900 mb-1.5">
                            Contact Number
                          </label>
                          <input
                            type="number"
                            name="contactNo"
                            value={editForm.contactNo}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white border border-emerald-200 rounded-xl focus:border-emerald-400 focus:ring-2 sm:focus:ring-3 focus:ring-emerald-100 focus:outline-none transition-all duration-300 text-emerald-900 text-base sm:text-lg"
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-emerald-900 mb-2 sm:mb-3">
                          {learner.name}
                        </h2>
                        <div className="flex flex-wrap items-center gap-2 mb-4 sm:mb-5">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium ${learner.isVerified
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                              }`}
                          >
                            {learner.isVerified ? (
                              <>
                                <FiCheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span>Verified</span>
                              </>
                            ) : (
                              <>
                                <FiXCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span>Not Verified</span>
                              </>
                            )}
                          </span>
                          <span className="text-emerald-600 text-xs sm:text-sm">
                            Member for {learner.registrationInfo?.daysAgo} days
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <div className="flex items-center gap-3 p-3 bg-emerald-50/50 rounded-xl">
                            <div className="p-2 bg-emerald-50 rounded-lg flex-shrink-0">
                              <FiMail className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs sm:text-sm text-emerald-600">
                                Email
                              </p>
                              <p className="font-medium text-emerald-900 text-sm sm:text-base truncate">
                                {learner.email}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-emerald-50/50 rounded-xl">
                            <div className="p-2 bg-emerald-50 rounded-lg flex-shrink-0">
                              <FiPhone className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs sm:text-sm text-emerald-600">
                                Contact
                              </p>
                              <p className="font-medium text-emerald-900 text-sm sm:text-base">
                                {learner.contactNo}
                              </p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>







            {/* Activity Timeline */}
            < div className="bg-white rounded-xl sm:rounded-2xl border border-emerald-100 shadow-sm overflow-hidden" >
              <div className="p-4 sm:p-5 md:p-6">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="p-2 bg-emerald-50 rounded-lg flex-shrink-0">
                    <FiActivity className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-emerald-900">
                      Activity Timeline
                    </h3>
                    <p className="text-xs sm:text-sm text-emerald-600">
                      Recent activities and interactions
                    </p>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="p-2 bg-emerald-50 rounded-lg mt-0.5 flex-shrink-0">
                      <FiCalendar className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-emerald-900 text-sm sm:text-base">
                        Account Created
                      </p>
                      <p className="text-xs sm:text-sm text-emerald-600 truncate">
                        {learner.registrationInfo?.date} at{" "}
                        {learner.registrationInfo?.time}
                      </p>
                    </div>
                    <span className="text-xs text-emerald-500 bg-emerald-50 px-2 py-1 rounded flex-shrink-0">
                      {learner.registrationInfo?.daysAgo}d ago
                    </span>
                  </div>

                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="p-2 bg-emerald-50 rounded-lg mt-0.5 flex-shrink-0">
                      <FiKey className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-emerald-900 text-sm sm:text-base">
                        Last Login
                      </p>
                      <p className="text-xs sm:text-sm text-emerald-600">
                        {learner.lastLogin
                          ? formatDate(learner.lastLogin)
                          : "Never logged in"}
                      </p>
                    </div>
                    {learner.lastLogin && (
                      <span className="text-xs text-emerald-500 bg-emerald-50 px-2 py-1 rounded flex-shrink-0">
                        {getTimeAgo(learner.lastLogin)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="p-2 bg-emerald-50 rounded-lg mt-0.5 flex-shrink-0">
                      <FiInfo className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-emerald-900 text-sm sm:text-base">
                        Last Visit
                      </p>
                      <p className="text-xs sm:text-sm text-emerald-600">
                        {learner.lastVisit
                          ? formatDate(learner.lastVisit)
                          : "No recent visits"}
                      </p>
                    </div>
                    {learner.lastVisit && (
                      <span className="text-xs text-emerald-500 bg-emerald-50 px-2 py-1 rounded flex-shrink-0">
                        {getTimeAgo(learner.lastVisit)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div >
          </motion.div >

          {/* Right Column - Stats & Quick Actions (Hidden on mobile unless in menu) */}
          < motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="hidden sm:block space-y-4 sm:space-y-5 md:space-y-6"
          >
            {/* Account Stats */}
            < div className="bg-white rounded-xl sm:rounded-2xl border border-emerald-100 shadow-sm overflow-hidden" >
              <div className="p-4 sm:p-5 md:p-6">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="p-2 bg-emerald-50 rounded-lg flex-shrink-0">
                    <FiShieldOff className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-emerald-900">
                      Account Stats
                    </h3>
                    <p className="text-xs sm:text-sm text-emerald-600">
                      Learner account information
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      label: "Account Status",
                      value: learner.isVerified
                        ? "Active & Verified"
                        : "Pending Verification",
                      icon: learner.isVerified ? FiCheckCircle : FiXCircle,
                      color: learner.isVerified ? "emerald" : "amber",
                    },
                    {
                      label: "Member Since",
                      value: `${learner.registrationInfo?.daysAgo} days`,
                      icon: FiCalendar,
                      color: "emerald",
                    },
                    {
                      label: "Last Active",
                      value: getTimeAgo(
                        learner.lastLogin ||
                        learner.lastVisit ||
                        learner.createdAt,
                      ),
                      icon: FiClock,
                      color: "emerald",
                    },
                    {
                      label: "Profile Updated",
                      value: getTimeAgo(learner.updatedAt),
                      icon: FiEdit2,
                      color: "emerald",
                    },
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-emerald-50/50 rounded-xl hover:bg-emerald-50 transition-colors duration-200 cursor-pointer active:scale-95"
                      onClick={() => {
                        if (index === 0 && !learner.isVerified) {
                          toast.success("Verification email sent!");
                        }
                      }}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm text-emerald-600">
                          {stat.label}
                        </p>
                        <p
                          className={`font-medium text-sm sm:text-base ${stat.color === "emerald"
                            ? "text-emerald-700"
                            : "text-amber-600"
                            }`}
                        >
                          {stat.value}
                        </p>
                      </div>
                      <div
                        className={`p-2 rounded-lg ${stat.color === "emerald"
                          ? "bg-emerald-100"
                          : "bg-amber-100"
                          }`}
                      >
                        <stat.icon
                          className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color === "emerald"
                            ? "text-emerald-600"
                            : "text-amber-600"
                            }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div >

            {/* Account Information */}
            < div className="bg-white rounded-xl sm:rounded-2xl border border-emerald-100 shadow-sm overflow-hidden" >
              <div className="p-4 sm:p-5 md:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-emerald-900 mb-3 sm:mb-4">
                  Account Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-emerald-600">
                      Learner ID
                    </span>
                    <code className="text-xs font-mono bg-emerald-50 text-emerald-700 px-2 py-1 rounded truncate max-w-[120px] sm:max-w-none">
                      {learner.id}
                    </code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-emerald-600">
                      Created
                    </span>
                    <span className="text-xs sm:text-sm text-emerald-900 text-right">
                      {formatDate(learner.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-emerald-600">
                      Last Updated
                    </span>
                    <span className="text-xs sm:text-sm text-emerald-900 text-right">
                      {formatDate(learner.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div >
          </motion.div >
        </div >
      </div >
    </div >
  );
};

export default LearnerPage;
