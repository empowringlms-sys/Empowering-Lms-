import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Building,
    Globe,
    Mail,
    Phone,
    Calendar,
    MapPin,
    User,
    ArrowLeft,
    CheckCircle,
    XCircle,
    Clock,
    Download,
} from "lucide-react";

const CompanyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [company, setCompany] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/companies/${id}`, {
                    withCredentials: true
                });

                if (response.data.success) {
                    setCompany(response.data.data);
                } else {
                    setError("Failed to fetch company details.");
                }
            } catch (err) {
                console.error("Error fetching company details:", err);
                setError("Error loading company details.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCompany();
    }, [id]);

    const getStatusBadge = (status) => {
        // Logic from Dashboard, mapping backend status (currently defaulted/missing) or adding logic
        // Since backend doesn't explicitly have 'status' yet beyond 'active' default we set in dashboard mapping,
        // we'll default to 'Active' visually if verified.
        const isVerified = company?.isVerified;
        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${isVerified ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                {isVerified ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                {isVerified ? "Active" : "Pending Verification"}
            </span>
        );
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    if (error || !company) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Error</h2>
                <p className="text-gray-600 mb-6">{error || "Company not found"}</p>
                <button
                    onClick={() => navigate("/dashboard")}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header Navigation */}
                <button
                    onClick={() => navigate("/dashboard")}
                    className="group flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors mb-6"
                >
                    <div className="p-2 rounded-full bg-white border border-gray-200 group-hover:border-emerald-200 shadow-sm">
                        <ArrowLeft className="h-5 w-5" />
                    </div>
                    <span className="font-medium">Back to Companies</span>
                </button>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Banner/Header Info */}
                    <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white border-2 border-emerald-100 shadow-md p-1">
                                    {company.logo ? (
                                        <img
                                            src={company.logo}
                                            alt={company.name}
                                            className="w-full h-full object-contain rounded-xl"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-emerald-50 flex items-center justify-center text-emerald-500 font-bold text-3xl">
                                            {company.name.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{company.name}</h1>
                                    <div className="flex flex-wrap items-center gap-3">
                                        {getStatusBadge()}
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                            {company.industry || 'Unspecified Industry'}
                                        </span>
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {company.estimatedStudents || 0} Learners Capacity
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                {/* Action Buttons could go here */}
                                {/* <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export Data
                 </button> */}
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Column: Details */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* Description */}
                                <section>
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">About Company</h2>
                                    <p className="text-gray-600 leading-relaxed">
                                        {company.description || "No description provided."}
                                    </p>
                                </section>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <Building className="h-5 w-5 text-emerald-600" />
                                            Organization Details
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="flex justify-between py-2 border-b border-gray-200 last:border-0">
                                                <span className="text-gray-500">Industry</span>
                                                <span className="font-medium text-gray-900">{company.industry || '-'}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-gray-200 last:border-0">
                                                <span className="text-gray-500">Registration No</span>
                                                <span className="font-medium text-gray-900">{company.registrationNo || '-'}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-gray-200 last:border-0">
                                                <span className="text-gray-500">Founded/Joined</span>
                                                <span className="font-medium text-gray-900">{new Date(company.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <Phone className="h-5 w-5 text-emerald-600" />
                                            Contact Information
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="flex justify-between py-2 border-b border-gray-200 last:border-0">
                                                <span className="text-gray-500 flex items-center gap-2"><Mail className="h-4 w-4" /> Email</span>
                                                <span className="font-medium text-gray-900">{company.email}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-gray-200 last:border-0">
                                                <span className="text-gray-500 flex items-center gap-2"><Phone className="h-4 w-4" /> Phone</span>
                                                <span className="font-medium text-gray-900">{company.contactNo || '-'}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-gray-200 last:border-0">
                                                <span className="text-gray-500 flex items-center gap-2"><Globe className="h-4 w-4" /> Country</span>
                                                <span className="font-medium text-gray-900">{company.country || '-'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Specific Address Section */}
                                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                        <MapPin className="h-5 w-5 text-emerald-600" />
                                        Headquarters Address
                                    </h3>
                                    <p className="text-gray-700">{company.address || "No address provided"}</p>
                                </div>
                            </div>

                            {/* Right Column: Key Stats / Sidebar */}
                            <div className="lg:col-span-1 space-y-6">
                                {/* Verification Status Card */}
                                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
                                    <h3 className="text-lg font-bold mb-1">Company Status</h3>
                                    <p className="opacity-90 text-sm mb-4">Current Subscription & Account Status</p>

                                    <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20 mb-4">
                                        <div className="flex items-center justify-between">
                                            <span>Account Verified</span>
                                            {company.isVerified ? (
                                                <div className="bg-white/20 p-1 rounded-full"><CheckCircle className="h-5 w-5" /></div>
                                            ) : (
                                                <div className="bg-white/20 p-1 rounded-full"><XCircle className="h-5 w-5" /></div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20">
                                        <div className="flex items-center justify-between">
                                            <span>Onboarding</span>
                                            {company.onboardingCompleted ? (
                                                <div className="bg-white/20 p-1 rounded-full"><CheckCircle className="h-5 w-5" /></div>
                                            ) : (
                                                <div className="bg-white/20 p-1 rounded-full"><XCircle className="h-5 w-5" /></div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Metadata Card */}
                                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                                    <h3 className="font-bold text-gray-900 mb-4">System Metadata</h3>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">ID</span>
                                            <span className="font-mono text-gray-700 bg-gray-100 px-2 py-0.5 rounded text-xs select-all">{company._id}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Last Login</span>
                                            <span className="text-gray-700">{company.lastLogin ? new Date(company.lastLogin).toLocaleString() : 'Never'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Last Updated</span>
                                            <span className="text-gray-700">{new Date(company.updatedAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Acquisition</span>
                                            <span className="text-gray-700">{company.hearAboutUs || 'Unknown'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyDetails;
