import React from "react";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import {
  FiUsers,
  FiPlus,
  FiSearch,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiUser,
  FiMail,
  FiCheck,
  FiX,
  FiRefreshCw,
  FiCheckCircle,
  FiCalendar,
  FiActivity,
} from "react-icons/fi";
import toast from "react-hot-toast";
import axiosInstance from "../../../utils/axiosInstance";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";

const StatCard = React.memo(function StatCard({
  title,
  value,
  icon: Icon,
  color,
  subtext,
}) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl border border-emerald-100 p-4 shadow-sm"
    >
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-sm text-emerald-600">{title}</p>
          <p className="text-2xl font-bold text-emerald-900">{value}</p>
          {subtext && (
            <p className="text-xs text-emerald-500 mt-1">{subtext}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-emerald-600" />
        </div>
      </div>
    </motion.div>
  );
});

export default function Learners() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [learners, setLearners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  console.log("learners : ", learners)



  const [stats, setStats] = useState({
    totalUsers: 0,
    verifiedUsers: 0,
    unverifiedUsers: 0,
    todayRegistrations: 0,
    thisWeekRegistrations: 0,
    activeUsers: 0,
    verifiedPercentage: 0,
  });

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    learnerId: null,
    learnerName: "",
    isLoading: false,
  });

  const searchTimeoutRef = useRef(null);
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
    rootMargin: "100px",
  });

  // Fetch statistics
  const fetchStatistics = useCallback(async () => {
    try {
      setLoadingStats(true);
      const response = await axiosInstance.get("/users/statistics");

      if (response?.data?.success) {
        setStats(response.data.data.statistics);
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
      toast.error("Failed to load statistics");
    } finally {
      setLoadingStats(false);
    }
  }, []);

  useEffect(() => {
    console.log("learners : ", learners);
  }, [learners]);

  // Fetch learners data with pagination
  const fetchLearners = useCallback(
    async (loadMore = false, resetPage = false, search = searchQuery) => {
      if ((!loadMore && loading) || (loadMore && loadingMore)) return;

      try {
        const pageToFetch = resetPage
          ? 1
          : loadMore
            ? currentPage + 1
            : currentPage;

        if (loadMore) {
          setLoadingMore(true);
        } else {
          setLoading(true);
          if (resetPage) {
            setCurrentPage(1);
          }
        }

        const params = {
          page: pageToFetch,
          limit: 20, // Fixed to 20 per page
          search: search || "",
        };

        const response = await axiosInstance.get("/users", { params });

        if (response?.data?.success) {
          const newLearners = response.data.data.learners;
          const pagination = response.data.data.pagination;

          if (loadMore) {
            setLearners((prev) => [...prev, ...newLearners]);
            setCurrentPage(pagination.currentPage);
          } else {
            setLearners(newLearners);
            setCurrentPage(pagination.currentPage);
          }

          setHasMore(pagination.hasMore);
          setTotalItems(pagination.totalUsers);
          setTotalPages(pagination.totalPages);
        }
      } catch (error) {
        console.error("Error fetching learners:", error);
        toast.error("Failed to load learners data");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [currentPage, searchQuery, loading, loadingMore],
  );

  // Initialize page with both learners and statistics
  const initializePage = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch both in parallel
      const [usersResponse, statsResponse] = await Promise.all([
        axiosInstance.get("/users", {
          params: {
            page: 1,
            limit: 20,
            search: searchQuery || "",
          },
        }),
        axiosInstance.get("/users/statistics"),
      ]);

      // Process users response
      if (usersResponse?.data?.success) {
        const newLearners = usersResponse.data.data.learners;
        const pagination = usersResponse.data.data.pagination;

        setLearners(newLearners);
        setCurrentPage(pagination.currentPage);
        setHasMore(pagination.hasMore);
        setTotalItems(pagination.totalUsers);
        setTotalPages(pagination.totalPages);
      }

      // Process statistics response
      if (statsResponse?.data?.success) {
        setStats(statsResponse.data.data.statistics);
      }
    } catch (error) {
      console.error("Error initializing page:", error);
      toast.error("Failed to load page data");
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  // Initial data fetch
  useEffect(() => {
    initializePage();
  }, []);

  // Handle search input with debounce
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(() => {
      fetchLearners(false, true, value);
    }, 500); // 500ms debounce
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery("");
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    fetchLearners(false, true, "");
  };

  // Load more when scroll reaches bottom
  useEffect(() => {
    if (inView && hasMore && !loading && !loadingMore) {
      fetchLearners(true, false, searchQuery);
    }
  }, [inView, hasMore, loading, loadingMore, fetchLearners, searchQuery]);

  // Handle row click to navigate to learner details
  const handleRowClick = (id) => {
    navigate(`/learners/${id}`);
  };

  // Handle delete button click
  const handleDeleteClick = (e, id, name) => {
    e.stopPropagation();
    setDeleteModal({
      isOpen: true,
      learnerId: id,
      learnerName: name,
      isLoading: false,
    });
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!deleteModal.learnerId) return;

    try {
      setDeleteModal((prev) => ({ ...prev, isLoading: true }));

      const response = await axiosInstance.delete(
        `/users/${deleteModal.learnerId}`,
      );
      if (response.data?.success) {
        toast.success("Learner deleted successfully");
        // Remove from local state
        setLearners((prev) =>
          prev.filter((learner) => learner._id !== deleteModal.learnerId),
        );
        // Update total count
        setTotalItems((prev) => prev - 1);
        // Refresh statistics
        await fetchStatistics();
      } else {
        throw new Error("Delete failed");
      }
    } catch (error) {
      console.error("Error deleting learner:", error);
      toast.error("Failed to delete learner");
    } finally {
      setDeleteModal({
        isOpen: false,
        learnerId: null,
        learnerName: "",
        isLoading: false,
      });
    }
  };

  // Handle view button click
  const handleView = (e, id) => {
    e.stopPropagation();
    navigate(`/learners/${id}`);
  };

  // Handle email button click
  const handleSendEmail = (e, id) => {
    e.stopPropagation();
    navigate(`/learners/email/${id}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Stats card component

  return (
    <div className="min-h-screen max-w-[1600px] mx-auto bg-gradient-to-b from-emerald-50/30 to-white p-4 md:p-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center">
                <FiUsers className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-emerald-900">
                  Learners Management
                </h1>
                <p className="text-emerald-600">
                  {loadingStats
                    ? "Loading statistics..."
                    : `${stats.totalUsers} learners registered`}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/learners/add")}
              className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <FiPlus className="w-4 h-4" />
              <span>Add Learner</span>
            </button>
            <button
              onClick={() => {
                initializePage();
              }}
              className="flex items-center gap-2 px-4 py-3 bg-emerald-50 text-emerald-700 font-medium rounded-xl hover:bg-emerald-100 transition-colors duration-200 cursor-pointer"
            >
              <FiRefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Section Removed */}
      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <div className="bg-white rounded-xl border border-emerald-100 p-4 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400" />
              <input
                type="text"
                placeholder="Search learners by name, email..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-11 pr-4 py-3 bg-white border border-emerald-200 rounded-xl focus:border-emerald-400 focus:ring-3 focus:ring-emerald-100 focus:outline-none transition-all duration-300 text-emerald-900 placeholder-emerald-400/60"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-400 hover:text-emerald-600 transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (searchQuery) {
                    fetchLearners(false, true, searchQuery);
                  }
                }}
                className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300"
                disabled={!searchQuery}
              >
                <FiSearch className="w-4 h-4" />
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Table Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden"
      >
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-emerald-100 bg-gradient-to-r from-emerald-50/50 to-white">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-emerald-900">
                Showing {learners.length} of {totalItems} learners
                {searchQuery && " (filtered)"}
              </span>
              {loading && (
                <div className="flex items-center gap-2 text-emerald-600 text-sm mt-1">
                  <FiRefreshCw className="w-4 h-4 animate-spin" />
                  <span>Loading...</span>
                </div>
              )}
            </div>
            <div className="text-sm text-emerald-600">
              Page {currentPage} of {totalPages}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto max-h-[calc(100vh-400px)] min-h-[500px] overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-white z-10">
              <tr className="bg-emerald-50/30">
                <th className="p-4 text-left font-semibold text-emerald-900">
                  <div className="flex items-center gap-2">
                    <FiUser className="w-4 h-4" />
                    Name
                  </div>
                </th>
                <th className="p-4 text-left font-semibold text-emerald-900">
                  <div className="flex items-center gap-2">
                    <FiMail className="w-4 h-4" />
                    Email
                  </div>
                </th>
                <th className="p-4 text-left font-semibold text-emerald-900">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {learners.length === 0 && !loading ? (
                <tr>
                  <td colSpan="3" className="p-8 text-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center mx-auto mb-4">
                      <FiUsers className="w-12 h-12 text-emerald-500" />
                    </div>
                    <h3 className="text-xl font-bold text-emerald-900 mb-2">
                      No Learners Found
                    </h3>
                    <p className="text-emerald-600">
                      {searchQuery
                        ? "Try a different search term"
                        : "No learners registered yet"}
                    </p>
                  </td>
                </tr>
              ) : (
                <>
                  {learners.map((learner, index) => (
                    <motion.tr
                      key={`${learner._id}-${index}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.02 }}
                      whileHover={{
                        backgroundColor: "rgba(209, 250, 229, 0.3)",
                      }}
                      className="border-b border-emerald-100 transition-colors duration-200 cursor-pointer hover:bg-emerald-50/50"
                      onClick={() => handleRowClick(learner._id)}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-semibold">
                            {learner.avatar ? (
                              <img
                                src={learner.avatar}
                                alt={learner.name}
                                className="w-full h-full object-cover rounded-full"
                              />
                            ) : (
                              <FiUser className="w-5 h-5" />
                            )}
                          </div>

                          <div>
                            <div className="font-medium text-emerald-900">
                              {learner.name}
                            </div>
                            <div className="text-xs text-emerald-600 whitespace-nowrap">
                              Joined: {formatDate(learner.createdAt)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-emerald-900">{learner.email}</div>
                      </td>
                      <td className="p-4">
                        <div
                          className="flex items-center gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={(e) => handleView(e, learner._id)}
                            className="p-2 hover:bg-emerald-100 rounded-lg text-emerald-600 hover:text-emerald-800 transition-colors duration-200 cursor-pointer"
                            title="View"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => handleSendEmail(e, learner._id)}
                            className="p-2 hover:bg-emerald-100 rounded-lg text-emerald-600 hover:text-emerald-800 transition-colors duration-200 cursor-pointer"
                            title="Send Email"
                          >
                            <FiMail className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) =>
                              handleDeleteClick(e, learner._id, learner.name)
                            }
                            className="p-2 hover:bg-rose-100 rounded-lg text-rose-600 hover:text-rose-800 transition-colors duration-200 cursor-pointer"
                            title="Delete"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}

                  {/* Load More Trigger */}
                  {hasMore && (
                    <tr ref={loadMoreRef}>
                      <td colSpan="3" className="p-4 text-center">
                        {loadingMore ? (
                          <div className="flex items-center justify-center gap-2 text-emerald-600">
                            <FiRefreshCw className="w-5 h-5 animate-spin" />
                            <span>Loading more learners...</span>
                          </div>
                        ) : (
                          <div className="text-emerald-600">
                            Scroll down to load more
                          </div>
                        )}
                      </td>
                    </tr>
                  )}

                  {/* Loading Skeleton */}
                  {loading &&
                    Array.from({ length: 20 }).map((_, index) => (
                      <tr
                        key={`skeleton-${index}`}
                        className="border-b border-emerald-100"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-200 animate-pulse"></div>
                            <div>
                              <div className="w-32 h-4 bg-emerald-200 rounded animate-pulse"></div>
                              <div className="w-24 h-3 bg-emerald-100 rounded animate-pulse mt-1"></div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="w-32 h-4 bg-emerald-200 rounded animate-pulse"></div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-emerald-200 rounded-lg animate-pulse"></div>
                            <div className="w-8 h-8 bg-emerald-200 rounded-lg animate-pulse"></div>
                          </div>
                        </td>
                      </tr>
                    ))}

                  {/* End of List Message */}
                  {!hasMore && learners.length > 0 && (
                    <tr>
                      <td colSpan="3" className="p-6 text-center">
                        <div className="inline-flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full">
                          <FiCheck className="w-4 h-4" />
                          <span>
                            All {searchQuery ? "filtered" : ""} learners loaded
                            ({learners.length} of {totalItems})
                          </span>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({
            isOpen: false,
            learnerId: null,
            learnerName: "",
            isLoading: false,
          })
        }
        onConfirm={handleDeleteConfirm}
        title="Delete Learner"
        description={`Are you sure you want to delete "${deleteModal.learnerName}"? This action cannot be undone.`}
        confirmText="Delete Learner"
        cancelText="Cancel"
        isLoading={deleteModal.isLoading}
      />
    </div>
  );
}


