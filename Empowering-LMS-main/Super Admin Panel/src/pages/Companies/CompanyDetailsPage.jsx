import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCompanyDetails, toggleCompanyAccess } from '../../services/companyApi';
import toast from 'react-hot-toast';
import { ArrowLeft, Building2, Users, BookOpen, Calendar, CreditCard, Shield, ShieldAlert, Mail, Phone, MapPin } from 'lucide-react';

const CompanyDetailsPage = () => {
    const { companyId } = useParams();
    const navigate = useNavigate();
    const [company, setCompany] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [toggling, setToggling] = useState(false);

    useEffect(() => {
        fetchDetails();
    }, [companyId]);

    const fetchDetails = async () => {
        try {
            const res = await getCompanyDetails(companyId);
            setCompany(res.data.data.company);
            setStats(res.data.data.stats);
        } catch (error) {
            console.error("Error fetching details:", error);
            toast.error("Failed to load company details");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleAccess = async () => {
        if (!window.confirm(`Are you sure you want to ${company.profile.manualAccessStatus ? 'REVOKE' : 'GRANT'} access for this company?`)) {
            return;
        }

        setToggling(true);
        try {
            const res = await toggleCompanyAccess(companyId);
            toast.success(res.data.message);
            // Update local state
            setCompany(prev => ({
                ...prev,
                profile: {
                    ...prev.profile,
                    manualAccessStatus: res.data.data.manualAccessStatus
                }
            }));
        } catch (error) {
            console.error("Error toggling access:", error);
            toast.error("Failed to update status");
        } finally {
            setToggling(false);
        }
    };

    if (loading) return <div className="flex h-screen items-center justify-center">Loading Details...</div>;
    if (!company) return <div className="text-center py-10">Company not found.</div>;

    const { account, profile, subscription } = company;
    const isGranted = profile.manualAccessStatus;

    return (
        <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            {account.name}
                            {!isGranted && <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full border border-red-200 font-bold uppercase">Access Revoked</span>}
                        </h1>
                        <p className="text-gray-500 text-sm">{account.email}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end mr-4">
                        <span className="text-xs text-gray-500 uppercase font-semibold">Manual Access Control</span>
                        <div className="flex items-center gap-2 mt-1">
                            <div className={`w-3 h-3 rounded-full ${isGranted ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
                            <span className={`text-sm font-medium ${isGranted ? 'text-green-700' : 'text-red-700'}`}>
                                {isGranted ? 'Active' : 'Blocked'}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={handleToggleAccess}
                        disabled={toggling}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-white font-medium shadow-sm transition-all transform hover:scale-105 ${isGranted
                                ? 'bg-red-600 hover:bg-red-700'
                                : 'bg-green-600 hover:bg-green-700'
                            }`}
                    >
                        {isGranted ? <ShieldAlert className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                        {toggling ? 'Processing...' : isGranted ? 'Revoke Access' : 'Grant Access'}
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Courses</p>
                        <h3 className="text-2xl font-bold text-gray-800">{stats.courseCount}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Learners</p>
                        <h3 className="text-2xl font-bold text-gray-800">{stats.learnerCount}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                        <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Subscription</p>
                        <h3 className="text-xl font-bold text-gray-800 capitalize">{subscription?.status || 'Inactive'}</h3>
                        <p className="text-xs text-gray-400 capitalize">{subscription?.planType || 'No Plan'}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Information */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-gray-500" />
                                Company Profile
                            </h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                            <div>
                                <label className="block text-xs font-medium text-gray-400 uppercase mb-1">Company Name</label>
                                <p className="text-gray-900 font-medium">{account.name}</p>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 uppercase mb-1">Industry</label>
                                <p className="text-gray-900 font-medium">{profile.industry || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 uppercase mb-1 flex items-center gap-1"><Mail className="w-3 h-3" /> Email</label>
                                <p className="text-gray-900 font-medium">{account.email}</p>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 uppercase mb-1 flex items-center gap-1"><Phone className="w-3 h-3" /> Contact No</label>
                                <p className="text-gray-900 font-medium">{profile.contactNo || 'N/A'}</p>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-medium text-gray-400 uppercase mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Address</label>
                                <p className="text-gray-900 font-medium">{profile.address || 'N/A'}</p>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-medium text-gray-400 uppercase mb-1">Description</label>
                                <p className="text-gray-700 text-sm leading-relaxed">{profile.description || 'No description provided.'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Subscription Details Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-gray-500" />
                                Subscription Status
                            </h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                                <span className="text-sm text-gray-500">Plan Type</span>
                                <span className="font-medium text-gray-900 capitalize">{subscription?.planType || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                                <span className="text-sm text-gray-500">Duration</span>
                                <span className="font-medium text-gray-900 capitalize text-right">
                                    {subscription?.planDurationMonths ? `${subscription.planDurationMonths} Months` : 'Monthly'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                                <span className="text-sm text-gray-500">Start Date</span>
                                <span className="font-medium text-gray-900 text-right">
                                    {subscription?.startDate ? new Date(subscription.startDate).toLocaleDateString() : 'N/A'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                                <span className="text-sm text-gray-500">Expires At</span>
                                <span className="font-medium text-gray-900 text-right">
                                    {subscription?.expiresAt ? new Date(subscription.expiresAt).toLocaleDateString() : 'N/A'}
                                </span>
                            </div>
                            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                <p className="text-xs text-center text-gray-400 mb-2">System Status</p>
                                <div className={`text-center py-1 px-3 rounded text-sm font-bold ${subscription?.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                    {subscription?.status?.toUpperCase() || 'INACTIVE'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyDetailsPage;
