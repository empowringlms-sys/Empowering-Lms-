import { useState, useRef, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { FiMenu, FiLogOut, FiSettings, FiUser, FiAlertCircle } from "react-icons/fi";
import { useAuth } from "../modules/auth/context/AuthContext";
import { useProfile } from "../modules/profile/context/ProfileContext";
import { FaUser } from "react-icons/fa";

// Map slugs to titles
const pageTitles = [
  { slug: "/home", title: "Home" },
  { slug: "/courses", title: "Courses" },
  { slug: "/certificates", title: "Certifications" },
  { slug: "/learners", title: "Learners" },
  { slug: "/media-files", title: "Media Files" },
  { slug: "/profile", title: "Company Profile" },
];

export default function TopBar({ onMenuClick }) {
  const location = useLocation();
  const { setShowLogoutModal, admin } = useAuth();
  const { profile, isProfileComplete } = useProfile();
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

        {/* Profile Image Trigger */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-300 focus:outline-none cursor-pointer flex items-center justify-center bg-emerald-50 relative"
          >
            {profile?.logo ? (
              <img
                src={profile.logo}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (profile?.account?.name || admin?.account?.name) ? (
              <span className="font-bold text-emerald-700">
                {(profile?.account?.name || admin?.account?.name).charAt(0).toUpperCase()}
              </span>
            ) : (
              <FaUser className="text-emerald-700 text-2xl" />
            )}

            {/* Profile Incomplete Indicator */}
            {!isProfileComplete && (
              <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
            )}
          </button>

          {/* Dropdown menu */}
          {showProfileDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50 z-[9999999] bg-white">

              <div className="px-4 py-2 border-b border-gray-100 mb-1">
                <p className="text-sm font-semibold text-gray-800 truncate">{profile?.account?.name || admin?.account?.name}</p>
                <p className="text-xs text-gray-500 truncate">{profile?.account?.email || admin?.account?.email}</p>
              </div>

              <Link
                to="/profile"
                className="flex items-center gap-2 w-full px-4 py-2 hover:bg-emerald-50 text-gray-700 cursor-pointer text-sm"
                onClick={() => setShowProfileDropdown(false)}
              >
                {isProfileComplete ? (
                  <>
                    <FiUser /> View Profile
                  </>
                ) : (
                  <>
                    <FiAlertCircle className="" />
                    Setup Profile
                  </>
                )}
              </Link>

              <button className="flex items-center gap-2 w-full px-4 py-2 hover:bg-emerald-50 text-gray-700 cursor-pointer text-sm">
                <FiSettings /> Account Settings
              </button>

              <div className="border-t border-gray-100 mt-1 pt-1">
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="flex items-center gap-2 w-full px-4 py-2 hover:bg-red-50 text-red-600 cursor-pointer text-sm"
                >
                  <FiLogOut /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
