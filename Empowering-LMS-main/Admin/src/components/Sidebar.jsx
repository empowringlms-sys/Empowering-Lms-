import { useState } from "react";
import { RiLoginBoxFill, RiLogoutBoxFill } from "react-icons/ri";
import { useAuth } from "../modules/auth/context/AuthContext";
import { useProfile } from "../modules/profile/context/ProfileContext";
import { NavLink } from "react-router-dom";
import { FaHome, FaUserGraduate } from "react-icons/fa";
import { SiCoursera } from "react-icons/si";
import { GrCertificate } from "react-icons/gr";
import { FiFile, FiBriefcase, FiEdit, FiExternalLink } from "react-icons/fi";
import SlugEditModal from "../modules/profile/components/SlugEditModal";

const baseClass =
  "flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition-all duration-200 cursor-pointer";

const activeClass =
  "bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 border-l-4 border-emerald-400 font-medium shadow-md";

const hoverClass = "hover:bg-emerald-50/70 hover:text-emerald-600";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const { isAuthenticated, setShowLogoutModal, admin } = useAuth();
  const { profile, updateProfile } = useProfile();
  const [isSlugModalOpen, setSlugModalOpen] = useState(false);

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
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="flex-1 overflow-y-auto py-4 px-3">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <div className="bg-white rounded-full w-28 h-28 flex items-center justify-center shadow-md border-2 border-emerald-100 overflow-hidden relative group">
            {profile?.logo ? (
              <img src={profile.logo} alt="Company Logo" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center justify-center text-emerald-400 bg-emerald-50 w-full h-full">
                <FiBriefcase className="text-4xl" />
              </div>
            )}
          </div>
        </div>

        <nav className="space-y-1">
          <NavLink to="home" className={({ isActive }) => `${baseClass} ${isActive ? activeClass : hoverClass}`} onClick={() => setSidebarOpen(false)}>
            <FaHome className="text-emerald-500 text-lg" />
            <span>Home</span>
          </NavLink>

          <NavLink to="courses" className={({ isActive }) => `${baseClass} ${isActive ? activeClass : hoverClass}`} onClick={() => setSidebarOpen(false)}>
            <SiCoursera className="text-emerald-500 text-lg" />
            <span>Courses</span>
          </NavLink>

          <NavLink to="certificates" className={({ isActive }) => `${baseClass} ${isActive ? activeClass : hoverClass}`} onClick={() => setSidebarOpen(false)}>
            <GrCertificate className="text-emerald-500 text-lg" />
            <span>Certificates</span>
          </NavLink>

          <NavLink to="learners" className={({ isActive }) => `${baseClass} ${isActive ? activeClass : hoverClass}`} onClick={() => setSidebarOpen(false)}>
            <FaUserGraduate className="text-emerald-500 text-lg" />
            <span>Learners</span>
          </NavLink>

          <NavLink to="media-files" className={({ isActive }) => `${baseClass} ${isActive ? activeClass : hoverClass}`} onClick={() => setSidebarOpen(false)}>
            <FiFile className="text-emerald-500 text-lg" />
            <span>Media Files</span>
          </NavLink>

          {/* Divider */}
          {/* <div className="pt-6 mt-4 border-t border-emerald-100">
            <p className="px-4 py-2 text-xs font-semibold text-emerald-600/60 uppercase">Account</p>

            {!isAuthenticated ? (
              <NavLink
                to="login"
                className={({ isActive }) => `${baseClass} ${isActive ? activeClass : hoverClass}`}
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

      {/* Learner Panel Link Footer */}
      {profile?.slug && (
        <div className="p-4 mt-auto relative z-10">
          <div className="absolute inset-x-0 bottom-0 top-0 bg-white/60 backdrop-blur-md border-t border-white/50 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]" />

          <div className="relative z-20">
            <div className="flex items-center gap-2 mb-2 px-1">
              <div className="text-[15px] font-bold text-emerald-900/70 ">Learner Portal : </div>
            </div>

            <div className="group bg-white rounded-xl border border-emerald-100/80 p-1 pr-1.5 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-2">
              <div
                className="flex-1 min-w-0 py-2 pl-3 cursor-pointer rounded-lg hover:bg-emerald-50/50 transition-colors"
                onClick={() => {
                  const baseUrl = profile.learnerPanelUrl?.replace(/\/$/, "") || "http://learner.com";
                  window.open(`${baseUrl}/${profile.slug}`, '_blank');
                }}
                title="Open Learner Panel"
              >
                <div className="flex flex-col">
                  <div className="text-xs font-bold text-gray-700 font-mono truncate flex items-center gap-1.5 group-hover:text-emerald-700 transition-colors">
                    {profile.learnerPanelUrl ? profile.learnerPanelUrl.replace(/^https?:\/\//, '').replace(/\/$/, '') : "learner.com"}/{profile.slug}
                    <FiExternalLink className="opacity-40 group-hover:opacity-100 transition-opacity" size={10} />
                  </div>
                </div>
              </div>

              <div className="h-8 w-px bg-gray-100" />

              <button
                onClick={() => setSlugModalOpen(true)}
                className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200 active:scale-95"
                title="Edit Slug"
              >
                <FiEdit size={15} />
              </button>
            </div>
          </div>
        </div>
      )}

      <SlugEditModal
        isOpen={isSlugModalOpen}
        onClose={() => setSlugModalOpen(false)}
        currentSlug={profile?.slug}
        updateProfile={updateProfile}
      />
    </aside>
  );
}
