import {
  FiBook,
  FiUsers,
  FiPlus,
  FiArrowRight,
} from "react-icons/fi";
import axiosInstance from "../../utils/axiosInstance";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

/* ================= STAT CARD ================= */
function StatCard({ title, value, icon: Icon, color, bgColor, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay }}
      className="bg-white rounded-3xl border border-gray-100 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 relative overflow-hidden group"
    >
      <div className={`absolute -right-6 -top-6 w-32 h-32 rounded-full ${bgColor} opacity-10 group-hover:scale-110 transition-transform duration-500`}></div>

      <div className="relative z-10">
        <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20`}>
          <Icon className="w-7 h-7 text-white" />
        </div>

        <h3 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">{value}</h3>
        <p className="text-base font-medium text-gray-500">{title}</p>
      </div>
    </motion.div>
  );
}

/* ================= ACTION CARD ================= */
function ActionCard({ title, description, icon: Icon, onClick, color, delay }) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: delay }}
      onClick={onClick}
      className="group relative w-full text-left bg-white rounded-3xl border border-gray-100 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className={`w-16 h-16 rounded-2xl bg-gray-50 group-hover:bg-white/20 flex items-center justify-center transition-colors duration-300 shadow-sm`}>
            <Icon className="w-8 h-8 text-gray-700 group-hover:text-white transition-colors duration-300" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-white transition-colors duration-300">{title}</h3>
            <p className="text-gray-500 group-hover:text-white/90 text-sm mt-1 transition-colors duration-300">{description}</p>
          </div>
        </div>

        <div className="w-10 h-10 rounded-full bg-gray-50 group-hover:bg-white/20 flex items-center justify-center transition-colors duration-300">
          <FiArrowRight className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors duration-300" />
        </div>
      </div>
    </motion.button>
  );
}

export default function Home() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get("/dashboard/stats");

      if (res?.data?.success) {
        setTotalUsers(res.data.data.totalUsers);
        setTotalCourses(res.data.data.totalCourses);
      }
    } catch (error) {
      console.error("Failed to load dashboard stats", error);
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="mb-4"
          >
            <FaSpinner className="w-10 h-10 text-emerald-500" />
          </motion.div>
          <p className="text-gray-500 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-[#FAFAFA] p-2 lg:p-6 "
    >
      <div className="max-w-7xl mx-auto space-y-12">

        {/* Header */}
        <motion.div
          variants={headerVariants}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Dashboard
            </h1>
            <p className="text-gray-500 mt-2 text-lg">
              Manage your academy efficiently.
            </p>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full inline-block">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </motion.div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <motion.div variants={itemVariants}>
            <StatCard
              title="Total Actual Courses"
              value={totalCourses}
              icon={FiBook}
              color="bg-emerald-500"
              bgColor="bg-emerald-500"
              delay={0}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatCard
              title="Total Learners"
              value={totalUsers}
              icon={FiUsers}
              color="bg-blue-500"
              bgColor="bg-blue-500"
              delay={0}
            />
          </motion.div>
        </div>

        {/* Quick Actions Title */}
        <motion.div
          variants={itemVariants}
          className="pt-4"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-emerald-500 rounded-full inline-block"></span>
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <motion.div variants={itemVariants}>
              <ActionCard
                title="Add New Learner"
                description="Manually register a new student to the platform."
                icon={FiPlus}
                onClick={() => navigate("/learners/add")}
                color="from-emerald-500 to-emerald-600"
                delay={0}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <ActionCard
                title="Create New Course"
                description="Draft and publish a new course catalog."
                icon={FiBook}
                onClick={() => navigate("/courses/create-course")}
                color="from-blue-500 to-blue-600"
                delay={0}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
