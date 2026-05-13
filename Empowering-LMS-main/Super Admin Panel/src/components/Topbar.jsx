import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FiMenu, FiLogOut, FiSettings, FiUser } from "react-icons/fi";
import { useAuth } from "../modules/auth/context/AuthContext";

// Map slugs to titles
const pageTitles = [
  { slug: "/home", title: "Home" },
  { slug: "/courses", title: "Courses" },
  { slug: "/certificates", title: "Certifications" },
  { slug: "/learners", title: "Learners" },
  { slug: "/media-files", title: "Media Files" },
];

export default function TopBar({ onMenuClick }) {
  const location = useLocation();
  const { setShowLogoutModal } = useAuth();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Find the title based on slug
  const currentPage = pageTitles.find((p) => p.slug === location.pathname);
  const title = currentPage ? currentPage.title : "Dashboard";

  return (
    <div className="h-14 flex items-center justify-between px-6 border-b border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-emerald-50 backdrop-blur-sm shadow-sm">
      
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg text-emerald-600 hover:text-white hover:bg-emerald-600 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer"
        >
          <FiMenu className="text-2xl" />
        </button>
        <h1 className="font-semibold text-emerald-800 tracking-wide">{title}</h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4 relative">
        {/* Logout button */}
        {/* <button
          onClick={() => setShowLogoutModal(true)}
          className="p-2 rounded-lg text-emerald-600 hover:text-white hover:bg-emerald-600 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer"
        >
          <FiLogOut className="text-2xl" />
        </button> */}

        {/* Profile Image */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-300 focus:outline-none cursor-pointer"
          >
            <img
              src="/logo.png" 
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </button>

          {/* Dropdown menu */}
          {showProfileDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
              <button className="flex items-center gap-2 w-full px-4 py-2 hover:bg-emerald-50 text-gray-700 cursor-pointer">
                <FiUser /> View Profile
              </button>
              <button className="flex items-center gap-2 w-full px-4 py-2 hover:bg-emerald-50 text-gray-700 cursor-pointer">
                <FiSettings /> Account Settings
              </button>
              <button
                onClick={() => setShowLogoutModal(true)}
                className="flex items-center gap-2 w-full px-4 py-2 hover:bg-emerald-50 text-red-600 cursor-pointer"
              >
                <FiLogOut /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
