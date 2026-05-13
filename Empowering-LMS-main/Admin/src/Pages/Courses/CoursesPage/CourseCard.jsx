// components/CourseCard.jsx
import { motion } from "framer-motion";
import { FaCog, FaEdit, FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import axiosInstance from "../../../../utils/axiosInstance";
import toast from "react-hot-toast";

export default function CourseCard({ course, onEdit, onManage, index }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(course.isVisible ?? true);
  const [isToggling, setIsToggling] = useState(false);

  const truncateDescription = (text, maxLength = 120) => {
    if (!text) return "No description available";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleToggleVisibility = async (e) => {
    e.stopPropagation();
    if (isToggling) return;

    setIsToggling(true);
    const previousState = isVisible;
    // Optimistic update
    setIsVisible(!previousState);

    try {
      const response = await axiosInstance.patch(
        `/courses/${course._id}/toggle-visibility`
      );

      if (response.data.success) {
        toast.success(response.data.message);
        // Ensure state matches backend
        setIsVisible(response.data.isVisible);
      } else {
        // Revert on failure
        setIsVisible(previousState);
        toast.error("Failed to update visibility");
      }
    } catch (error) {
      console.error("Error toggling visibility:", error);
      setIsVisible(previousState);
      toast.error("Error updating visibility");
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="relative h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 transition-all duration-300 h-full flex flex-col cursor-pointer group hover:shadow-[0_10px_30px_rgba(0,0,0,0.15)]"
        onClick={() => onManage()}
      >
        <div className="relative h-48 overflow-hidden">
          <img
            src={course.coverArt}
            alt={course.courseName}
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${!isVisible ? "grayscale opacity-80" : ""
              }`}
          />

          {/* Overlay for hidden state */}
          {!isVisible && (
            <div className="absolute inset-0 bg-gray-900/40 flex items-center justify-center backdrop-blur-[1px]">
              <div className="bg-black/60 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2">
                <FaEyeSlash /> Hidden from Learners
              </div>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-teal-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Visibility Switch - Top Left (Only for non-global courses) */}
          {!course.isGlobal && (
            <div
              className="absolute top-2 left-2 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full shadow-md transition-all duration-300 backdrop-blur-md border ${isVisible
                  ? "bg-white/90 border-emerald-100 text-emerald-700"
                  : "bg-gray-100/90 border-gray-200 text-gray-600"
                  }`}
              >
                <div
                  onClick={handleToggleVisibility}
                  className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${isVisible ? "bg-emerald-500" : "bg-gray-300"
                    }`}
                >
                  <div
                    className={`bg-white w-3.5 h-3.5 rounded-full shadow-sm transform transition-transform duration-300 ${isVisible ? "translate-x-5" : "translate-x-0"
                      }`}
                  />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider">
                  {isVisible ? "Visible" : "Hidden"}
                </span>
              </div>
            </div>
          )}

          {/* Global Badge */}
          {course.isGlobal && (
            <div className="absolute top-2 left-2 z-10">
              <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md uppercase tracking-wider">
                Global Course
              </div>
            </div>
          )}

          {/* Edit icon on top-right (Only for non-global courses) */}
          {!course.isGlobal && (
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={isHovered ? { x: 0, opacity: 1 } : { x: 20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-teal-50"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              <FaEdit className="text-teal-600 w-4 h-4" />
            </motion.div>
          )}
        </div>

        <div className="p-5 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-3 gap-3">
            <h3 className={`text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-teal-600 transition-colors duration-300 ${!isVisible && "opacity-60"}`}>
              {course.courseName}
            </h3>
          </div>

          <p className="text-gray-600 text-sm mb-4 flex-1 line-clamp-3 min-h-[4.5rem]">
            {truncateDescription(course.description)}
          </p>

          <div className="flex items-center justify-between text-xs text-gray-500 mb-5">
            {/* <span className="font-medium">by {course.author || "Unknown"}</span> */}
            <span className="font-medium">By Empowering</span>
            {course.createdAt && <span>{formatDate(course.createdAt)}</span>}
          </div>

          <div className="flex gap-2 pt-4 border-t border-gray-100">
            <motion.button
              whileHover={{
                backgroundColor: "#e6f7f2",
                borderColor: "#13c9c9",
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.stopPropagation();
                onManage();
              }}
              className="flex-1 bg-teal-50 text-teal-700 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border border-teal-100 hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              {course.isGlobal ? <FaEye className="w-3.5 h-3.5" /> : <FaCog className="w-3.5 h-3.5" />}
              {course.isGlobal ? "View Details" : "Manage"}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}