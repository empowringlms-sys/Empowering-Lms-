import { useState, useRef, useEffect } from "react";
import { useLocation, Link, useParams } from "react-router-dom";
import { FiMenu, FiLogOut, FiSettings, FiUser } from "react-icons/fi";
import { useAuthContext } from "../modules/userAuth/AuthContext";
import { FaUser } from "react-icons/fa";

// Map slugs to titles
const pageTitles = [
    { slug: "/dashboard", title: "Dashboard" },
    { slug: "/dashboard/courses", title: "My Courses" },
];

export default function Header({ onMenuClick }) {
    const location = useLocation();
    const { slug } = useParams();
    const { logout, userData } = useAuthContext();
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
    // Simple matching usually works, but for dynamic routes you might need more complex logic.
    // For now, let's just check if it starts with the known paths
    let title = "Dashboard";
    if (location.pathname.includes("/dashboard/courses")) {
        title = "My Courses";
    } else if (location.pathname.includes("/dashboard/profile")) {
        title = "My Profile";
    }


    console.log(userData)

    return (
        <div className="h-14 flex items-center justify-between px-6 border-b border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-emerald-50 backdrop-blur-sm shadow-sm sticky top-0 z-30">

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

                {/* Profile Image Trigger */}
                <div ref={dropdownRef} className="relative">
                    <button
                        onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                        className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-300 focus:outline-none cursor-pointer flex items-center justify-center bg-emerald-50 relative"
                    >
                        {userData?.avatar ? (
                            <img
                                src={userData.avatar}
                                alt={userData?.name || "User"}
                                className="w-full h-full object-cover"
                            />
                        ) : userData?.name ? (
                            <span className="font-bold text-emerald-700">
                                {userData.name.charAt(0).toUpperCase()}
                            </span>
                        ) : (
                            <FaUser className="text-emerald-700 text-lg" />
                        )}
                    </button>

                    {/* Dropdown menu */}
                    {showProfileDropdown && (
                        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50 z-[9999] z-[9999999]">

                            <div className="px-4 py-2 border-b border-gray-100 mb-1">
                                <p className="text-sm font-semibold text-gray-800 truncate">{userData?.name || "Learner"}</p>
                                <p className="text-xs text-gray-500 truncate">{userData?.email}</p>
                            </div>

                            <Link
                                to={`/${slug}/dashboard/profile`}
                                className="flex items-center gap-2 w-full px-4 py-2 hover:bg-emerald-50 text-gray-700 cursor-pointer text-sm"
                                onClick={() => setShowProfileDropdown(false)}
                            >
                                <FiUser /> Profile
                            </Link>

                            <div className="border-t border-gray-100 mt-1 pt-1">
                                <button
                                    onClick={() => {
                                        logout(true);
                                        setShowProfileDropdown(false);
                                    }}
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


