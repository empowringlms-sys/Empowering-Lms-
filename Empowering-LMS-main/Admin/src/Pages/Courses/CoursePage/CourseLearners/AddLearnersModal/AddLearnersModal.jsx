import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiSearch,
  FiUser,
  FiMail,
  FiCheck,
  FiUsers,
  FiPlus,
  FiUserCheck,
  FiAlertCircle,
  FiLoader,
  FiCheckCircle,
  FiChevronRight,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import axiosInstance from "../../../../../../utils/axiosInstance";

const AddLearnersModal = ({ isOpen, onClose, courseId, courseName, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Fetch all users from the backend
  const fetchAllUsers = useCallback(async () => {
    try {
      setLoadingUsers(true);
      const response = await axiosInstance.get("/users/all");

      if (response?.data?.success) {
        const users = response.data.data.users || [];
        
        // Filter out users who don't have required fields
        const validUsers = users.filter(user => 
          user._id && user.name && user.email
        );

        setAllUsers(validUsers);
        
        // Clear any existing selection when users are loaded
        setSelectedUsers(new Set());
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
      setAllUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  // Load users when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchAllUsers();
      setSearchQuery("");
      setSelectedUsers(new Set());
    }
  }, [isOpen, fetchAllUsers]);

  // Filter users based on search
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return allUsers;

    const query = searchQuery.toLowerCase().trim();
    return allUsers.filter(user =>
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      (user.contactNo && user.contactNo.toLowerCase().includes(query))
    );
  }, [allUsers, searchQuery]);

  // Handle user selection
  const handleUserSelect = (userId) => {
    setSelectedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  // Select all filtered users
  const handleSelectAll = () => {
    if (filteredUsers.length === 0) return;
    
    const allFilteredIds = filteredUsers.map(user => user._id);
    setSelectedUsers(new Set(allFilteredIds));
  };

  // Clear all selections
  const handleClearAll = () => {
    setSelectedUsers(new Set());
  };

  // Add selected learners to course
  const handleAddLearners = async () => {
    if (selectedUsers.size === 0) {
      toast.error("Please select at least one learner");
      return;
    }

    try {
      setAdding(true);
      const learnerIds = Array.from(selectedUsers);

      const response = await axiosInstance.post(
        `/courses/${courseId}/learners`,
        { learnerIds }
      );

      if (response?.data?.success) {
        // Call success callback if provided
        if (onSuccess) {
          onSuccess(learnerIds.length);
        }
        
        // Close modal
        onClose();
      }
    } catch (error) {
      console.error("Error adding learners:", error);
      const errorMessage = error.response?.data?.message || "Failed to add learners";
      toast.error(errorMessage);
    } finally {
      setAdding(false);
    }
  };

  // Get user initials
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Modal backdrop click handler
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={handleBackdropClick}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-gradient-to-br from-emerald-50/50 to-white rounded-2xl border border-emerald-200 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <FiUserCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Add Learners to Course
                  </h2>
                  <p className="text-emerald-100 text-sm">
                    {courseName || "Loading course..."}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white hover:scale-110 transition-all duration-200 cursor-pointer"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col h-[calc(90vh-80px)]">
            {/* Stats and Actions Bar */}
            <div className="px-6 py-4 border-b border-emerald-100 bg-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
                    <span className="font-bold">{allUsers.length}</span> total users
                  </div>
                  <div className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                    <span className="font-bold">{selectedUsers.size}</span> selected
                  </div>
                  <div className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-sm font-medium">
                    <span className="font-bold">{filteredUsers.length}</span> showing
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSelectAll}
                    disabled={filteredUsers.length === 0}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm font-medium"
                  >
                    <FiUserCheck className="w-4 h-4" />
                    Select All
                  </button>
                  <button
                    onClick={handleClearAll}
                    disabled={selectedUsers.size === 0}
                    className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm font-medium"
                  >
                    <FiX className="w-4 h-4" />
                    Clear All
                  </button>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="px-6 py-4 border-b border-emerald-100 bg-white">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400" />
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-emerald-200 rounded-xl focus:border-emerald-400 focus:ring-3 focus:ring-emerald-100 focus:outline-none transition-all duration-300 text-emerald-900 placeholder-emerald-400/60"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-400 hover:text-emerald-600 transition-colors cursor-pointer"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Users Table */}
            <div className="flex-1 overflow-y-auto">
              {loadingUsers ? (
                // Loading state
                <div className="p-6">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div
                      key={`skeleton-${index}`}
                      className="mb-3 bg-white border border-emerald-100 rounded-xl p-4 animate-pulse"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-200"></div>
                        <div className="flex-1 space-y-2">
                          <div className="w-48 h-4 bg-emerald-200 rounded"></div>
                          <div className="w-32 h-3 bg-emerald-100 rounded"></div>
                        </div>
                        <div className="w-6 h-6 bg-emerald-200 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredUsers.length === 0 ? (
                // Empty state
                <div className="h-full flex flex-col items-center justify-center p-8">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center mb-4">
                    <FiUsers className="w-10 h-10 text-emerald-500" />
                  </div>
                  <h3 className="text-lg font-bold text-emerald-900 mb-2">
                    {searchQuery ? "No Users Found" : "No Users Available"}
                  </h3>
                  <p className="text-emerald-600 text-center mb-4">
                    {searchQuery
                      ? "Try a different search term"
                      : "No users found in the system"}
                  </p>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              ) : (
                // Users table with rows
                <div className="p-6">
                  <div className="bg-white rounded-xl border border-emerald-100 overflow-hidden">
                    {/* Table Header */}
                    <div className="bg-gradient-to-r from-emerald-50/50 to-green-50/50 px-4 py-3 border-b border-emerald-100">
                      <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-5 flex items-center gap-2">
                          <FiUser className="w-4 h-4 text-emerald-600" />
                          <span className="text-sm font-semibold text-emerald-900">
                            Name
                          </span>
                        </div>
                        <div className="col-span-5 flex items-center gap-2">
                          <FiMail className="w-4 h-4 text-emerald-600" />
                          <span className="text-sm font-semibold text-emerald-900">
                            Email
                          </span>
                        </div>
                        <div className="col-span-2 flex items-center justify-center gap-2">
                          <FiCheckCircle className="w-4 h-4 text-emerald-600" />
                          <span className="text-sm font-semibold text-emerald-900">
                            Status
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Users Rows */}
                    <div className="divide-y divide-emerald-100/50">
                      {filteredUsers.map((user) => {
                        const isSelected = selectedUsers.has(user._id);
                        return (
                          <motion.div
                            key={user._id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            whileHover={{ backgroundColor: "rgba(209, 250, 229, 0.3)" }}
                            className={`px-4 py-3 transition-all duration-200 cursor-pointer ${
                              isSelected ? "bg-emerald-50/50" : "hover:bg-emerald-50/30"
                            }`}
                            onClick={() => handleUserSelect(user._id)}
                          >
                            <div className="grid grid-cols-12 gap-4 items-center">
                              {/* Name Column */}
                              <div className="col-span-5 flex items-center gap-3">
                                {/* Custom Checkbox */}
                                <div
                                  className={`relative w-5 h-5 rounded-lg border-2 transition-all duration-200 flex items-center justify-center cursor-pointer ${
                                    isSelected
                                      ? "bg-emerald-500 border-emerald-500"
                                      : "bg-white border-emerald-300 hover:border-emerald-400"
                                  }`}
                                >
                                  {isSelected && (
                                    <FiCheck className="w-3 h-3 text-white" />
                                  )}
                                </div>
                                
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-xs font-semibold">
                                    {getInitials(user.name)}
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-emerald-900">
                                      {user.name}
                                    </h4>
                                    {user.contactNo && user.contactNo !== 'N/A' && (
                                      <p className="text-xs text-emerald-500">
                                        {user.contactNo}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Email Column */}
                              <div className="col-span-5">
                                <p className="text-emerald-800 text-sm truncate">
                                  {user.email}
                                </p>
                              </div>

                              {/* Status Column */}
                              <div className="col-span-2 flex items-center justify-center">
                                <span
                                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                                    user.isVerified
                                      ? "bg-emerald-100 text-emerald-800"
                                      : "bg-amber-100 text-amber-800"
                                  }`}
                                >
                                  {user.isVerified ? (
                                    <>
                                      <FiCheck className="w-3 h-3" />
                                      Verified
                                    </>
                                  ) : (
                                    <>
                                      <FiX className="w-3 h-3" />
                                      Pending
                                    </>
                                  )}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Summary */}
                  {filteredUsers.length > 0 && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4 text-emerald-700">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                            <span>
                              Selected: <span className="font-bold">{selectedUsers.size}</span>
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                            <span>
                              Showing: <span className="font-bold">{filteredUsers.length}</span>
                            </span>
                          </div>
                        </div>
                        <div className="text-emerald-600">
                          {searchQuery ? "Filtered results" : "All users"}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 border-t border-emerald-100 bg-white px-6 py-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-sm text-emerald-600">
                  <div className="flex items-center gap-2">
                    <FiAlertCircle className="w-4 h-4 text-emerald-500" />
                    <span>
                      {selectedUsers.size === 0
                        ? "Select users to add as learners"
                        : `${selectedUsers.size} user${selectedUsers.size > 1 ? "s" : ""} selected for enrollment`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={onClose}
                    disabled={adding}
                    className="px-5 py-2.5 border border-emerald-200 text-emerald-700 rounded-xl hover:bg-emerald-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddLearners}
                    disabled={selectedUsers.size === 0 || adding}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:shadow-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-medium"
                  >
                    {adding ? (
                      <>
                        <FiLoader className="w-4 h-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <FiPlus className="w-4 h-4" />
                        Add {selectedUsers.size > 0 ? `(${selectedUsers.size})` : ""} Learners
                        <FiChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddLearnersModal;