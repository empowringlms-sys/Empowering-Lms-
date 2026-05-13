import { NavLink, useParams } from "react-router-dom";
import { FaHome, FaBook } from "react-icons/fa";
import { useAuthContext } from "../modules/userAuth/AuthContext";
import { useCompanyProfileContext } from "../modules/CompanyProfile/CompanyProfileContext";
import { FiUser } from "react-icons/fi";

const baseClass =
    "flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition-all duration-200 cursor-pointer";

const activeClass =
    "bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 border-l-4 border-emerald-400 font-medium shadow-md";

const hoverClass = "hover:bg-emerald-50/70 hover:text-emerald-600";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
    const { userData } = useAuthContext();
    const { companyData } = useCompanyProfileContext();
    const { slug } = useParams();

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
                {/* User Info / Logo */}
                <div className="flex justify-center mb-6 mt-2">
                    <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center shadow-md border-2 border-emerald-100 overflow-hidden relative group">
                        {companyData?.profile?.logo ? (
                            <img
                                src={companyData.profile.logo}
                                alt={companyData?.name || "Company"}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center text-emerald-400 bg-emerald-50 w-full h-full">
                                {userData?.name ? (
                                    <span className="text-3xl font-bold text-emerald-600">
                                        {userData.name.charAt(0).toUpperCase()}
                                    </span>
                                ) : (
                                    <FiUser className="text-3xl" />
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="text-center mb-6 lg:hidden">
                    <h3 className="font-semibold text-emerald-800">{userData?.name || "Learner"}</h3>
                    <p className="text-xs text-gray-500">{userData?.email}</p>
                </div>


                <nav className="space-y-1">
                    <NavLink
                        to={`/${slug}/dashboard`}
                        end
                        className={({ isActive }) => `${baseClass} ${isActive ? activeClass : hoverClass}`}
                        onClick={() => setSidebarOpen(false)}
                    >
                        <FaHome className="text-emerald-500 text-lg" />
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink
                        to={`/${slug}/dashboard/courses`}
                        className={({ isActive }) => `${baseClass} ${isActive ? activeClass : hoverClass}`}
                        onClick={() => setSidebarOpen(false)}
                    >
                        <FaBook className="text-emerald-500 text-lg" />
                        <span>My Courses</span>
                    </NavLink>
                </nav>
            </div>
        </aside>
    );
}
