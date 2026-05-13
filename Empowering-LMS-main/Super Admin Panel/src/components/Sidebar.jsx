import { RiLoginBoxFill, RiLogoutBoxFill } from "react-icons/ri";
import { useAuth } from "../modules/auth/context/AuthContext";
import { NavLink } from "react-router-dom";
import { FaHome, FaUserGraduate } from "react-icons/fa";
import { SiCoursera } from "react-icons/si";
import { GrCertificate } from "react-icons/gr";
import { FiFile, FiImage } from "react-icons/fi";

const baseClass =
  "flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition-all duration-200 cursor-pointer";

const activeClass =
  "bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 border-l-4 border-emerald-400 font-medium shadow-md";

const hoverClass = "hover:bg-emerald-50/70 hover:text-emerald-600";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const { isAuthenticated, setShowLogoutModal } = useAuth();

  return (
    <aside
      className={`fixed md:relative top-0 left-0 z-40 h-screen w-64 bg-gradient-to-b from-green-100 to-blue-100 text-gray-700 border-r border-emerald-100 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 flex flex-col`}
    >
      {/* Mobile Close Button */}
      <button
        onClick={() => setSidebarOpen(false)}
        className="md:hidden absolute top-4 right-4 z-50 p-2 bg-white rounded-lg shadow-sm border border-emerald-200 text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <div className="flex-1 overflow-y-auto py-4 px-3">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-emerald-100">
            <img src="/logo.png" alt="Logo" className="w-28" />
          </div>
        </div>

        <nav className="space-y-1">
          <NavLink
            to="dashboard"
            className={({ isActive }) =>
              `${baseClass} ${isActive ? activeClass : hoverClass}`
            }
            onClick={() => setSidebarOpen(false)}
          >
            <FaHome className="text-emerald-500 text-lg" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="courses"
            className={({ isActive }) =>
              `${baseClass} ${isActive ? activeClass : hoverClass}`
            }
            onClick={() => setSidebarOpen(false)}
          >
            <SiCoursera className="text-emerald-500 text-lg" />
            <span>Global Courses</span>
          </NavLink>

          <NavLink
            to="/media-library"
            className={({ isActive }) =>
              `${baseClass} ${isActive ? activeClass : hoverClass}`
            }
            onClick={() => setSidebarOpen(false)}
          >
            <FiImage className="text-emerald-500 text-lg" />
            <span>Media Library</span>
          </NavLink>

          {/* Divider */}
          {/* <div className="pt-6 mt-4 border-t border-emerald-100">
            <p className="px-4 py-2 text-xs font-semibold text-emerald-600/60 uppercase">
              Account
            </p>

            {!isAuthenticated ? (
              <NavLink
                to="login"
                className={({ isActive }) =>
                  `${baseClass} ${isActive ? activeClass : hoverClass}`
                }
              >
                <RiLoginBoxFill className="text-emerald-500 text-lg" />
                <span>Login</span>
              </NavLink>
            ) : (
              <button
                onClick={() => setShowLogoutModal(true)}
                className={`${baseClass} ${hoverClass} w-full text-left`}
              >
                <RiLogoutBoxFill className="text-red-500 text-lg" />
                <span>Logout</span>
              </button>
            )}
          </div> */}
        </nav>
      </div>
    </aside>
  );
}
