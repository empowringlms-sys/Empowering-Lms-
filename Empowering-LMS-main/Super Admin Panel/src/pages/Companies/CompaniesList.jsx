import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCompanies } from '../../services/companyApi';
import toast from 'react-hot-toast';

const CompaniesList = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const res = await getAllCompanies();
            setCompanies(res.data.data);
        } catch (error) {
            console.error("Error fetching companies:", error);
            toast.error("Failed to load companies");
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'inactive': return 'bg-red-100 text-red-800';
            case 'past_due': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) return <div className="text-center py-10">Loading Companies...</div>;

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-800">Registered Companies</h3>
                <span className="text-sm text-gray-500">{companies.length} Companies</span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-700 font-medium uppercase text-xs">
                        <tr>
                            <th className="px-6 py-3">Company Name</th>
                            <th className="px-6 py-3">Email</th>
                            <th className="px-6 py-3 text-center">Plan</th>
                            <th className="px-6 py-3 text-center">Courses</th>
                            <th className="px-6 py-3 text-center">Learners</th>
                            <th className="px-6 py-3 text-center">Sub Status</th>
                            <th className="px-6 py-3 text-center">Access</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {companies.map((company) => (
                            <tr
                                key={company._id}
                                onClick={() => navigate(`/companies/${company._id}`)}
                                className="hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs uppercase">
                                            {company.account.name.substring(0, 2)}
                                        </div>
                                        {company.account.name}
                                    </div>
                                </td>
                                <td className="px-6 py-4">{company.account.email}</td>
                                <td className="px-6 py-4 text-center capitalize">
                                    {company.subscription?.planType || 'None'}
                                </td>
                                <td className="px-6 py-4 text-center font-semibold text-gray-700">
                                    {company.stats?.courses || 0}
                                </td>
                                <td className="px-6 py-4 text-center font-semibold text-gray-700">
                                    {company.stats?.learners || 0}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(company.subscription?.status)}`}>
                                        {company.subscription?.status || 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`w-2 h-2 inline-block rounded-full mr-2 ${company.profile.manualAccessStatus ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                    {company.profile.manualAccessStatus ? 'Granted' : 'Revoked'}
                                </td>
                            </tr>
                        ))}
                        {companies.length === 0 && (
                            <tr>
                                <td colSpan="7" className="text-center py-8 text-gray-400">No companies found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CompaniesList;
