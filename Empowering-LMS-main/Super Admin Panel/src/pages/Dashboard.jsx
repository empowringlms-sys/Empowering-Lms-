import React, { useState, useEffect } from "react";
import {
  Building,
  Users,
  Globe,
  Mail,
  Phone,
  Calendar,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  ChevronDown,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  BarChart3,
  Plus,
  RefreshCw,
  Link,
  MapPin,
  User,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import CompaniesList from "./Companies/CompaniesList";

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPlan, setSelectedPlan] = useState("all");

  const [viewMode, setViewMode] = useState("list"); // 'grid' or 'list'
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/companies/all`, {
          withCredentials: true
        });

        if (response.data.success) {
          const mappedCompanies = response.data.data.map((company) => ({
            id: company._id,
            companyName: company.name,
            logo: company.logo || "https://via.placeholder.com/100?text=Logo",
            email: company.email,
            phone: company.contactNo || "N/A",
            industry: company.industry || "Unspecified",
            country: company.country || "Unspecified",
            address: company.address || "Unspecified",
            registrationNumber: company.registrationNo || "N/A",
            estimatedLearners: parseInt(company.estimatedStudents) || 0,
            referralSource: company.hearAboutUs || "N/A",
            status: "active", // Default for onboarded companies
            plan: "Standard", // Placeholder
            monthlyFee: "$0", // Placeholder
            createdDate: new Date(company.createdAt).toLocaleDateString(),
            lastActive: company.lastLogin ? new Date(company.lastLogin).toLocaleDateString() : new Date(company.updatedAt).toLocaleDateString(),
            accountOwner: company.name, // Using company name as owner for now if not available
            accountEmail: company.email,
            accountPhone: company.contactNo || "N/A",
            courses: 0,
            activeStudents: 0,
            completionRate: "0%",
            satisfactionScore: 5.0,
            paymentStatus: "paid",
          }));
          setCompanies(mappedCompanies);
        }
      } catch (err) {
        console.error("Error fetching companies:", err);
        setError("Failed to load companies");
        // Keep companies empty if failed
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  // Calculate stats
  const stats = {
    totalCompanies: companies.length,
    activeCompanies: companies.filter((c) => c.status === "active").length,
    trialCompanies: companies.filter((c) => c.status === "trial").length,
    totalLearners: companies.reduce((sum, c) => sum + c.estimatedLearners, 0),
    monthlyRevenue: companies.reduce((sum, c) => {
      const fee = parseFloat(c.monthlyFee.replace("$", "")) || 0;
      return c.paymentStatus === "paid" ? sum + fee : sum;
    }, 0),
    averageRating: (
      companies.reduce((sum, c) => sum + c.satisfactionScore, 0) /
      companies.length
    ).toFixed(1),
  };

  // Filter companies based on search and filters
  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      searchTerm === "" ||
      company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" || company.status === selectedStatus;
    const matchesPlan = selectedPlan === "all" || company.plan === selectedPlan;

    return matchesSearch && matchesStatus && matchesPlan;
  });

  const getStatusBadge = (status) => {
    const styles = {
      active: "bg-emerald-100 text-emerald-800",
      trial: "bg-blue-100 text-blue-800",
      pending: "bg-amber-100 text-amber-800",
      suspended: "bg-red-100 text-red-800",
    };
    const icons = {
      active: <CheckCircle className="h-3 w-3" />,
      trial: <Clock className="h-3 w-3" />,
      pending: <Clock className="h-3 w-3" />,
      suspended: <XCircle className="h-3 w-3" />,
    };
    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}
      >
        {icons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getPlanBadge = (plan) => {
    const styles = {
      Enterprise: "bg-purple-100 text-purple-800",
      Professional: "bg-blue-100 text-blue-800",
      Starter: "bg-gray-100 text-gray-800",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${styles[plan]}`}
      >
        {plan}
      </span>
    );
  };

  const getPaymentStatusBadge = (status) => {
    const styles = {
      paid: "bg-emerald-100 text-emerald-800",
      trial: "bg-blue-100 text-blue-800",
      pending: "bg-amber-100 text-amber-800",
      overdue: "bg-red-100 text-red-800",
    };
    return (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${styles[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Super Admin Panel
            </h1>
            <p className="text-gray-600 text-sm">
              Manage all companies and monitor platform performance
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/add/company")}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Add Company
            </button>
            <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer">
              <RefreshCw className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Total Companies",
              value: stats.totalCompanies,
              icon: Building,
              change: "+12%",
              color: "emerald",
            },
            {
              label: "Active Companies",
              value: stats.activeCompanies,
              icon: CheckCircle,
              change: "+8%",
              color: "blue",
            },
            {
              label: "Total Learners",
              value: stats.totalLearners.toLocaleString(),
              icon: Users,
              change: "+24%",
              color: "purple",
            },
            {
              label: "Monthly Revenue",
              value: `$${stats.monthlyRevenue}`,
              icon: BarChart3,
              change: "+18%",
              color: "amber",
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-${stat.color}-100`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
                <span className="text-sm font-medium text-emerald-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {stat.change}
                </span>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-900">
                  {stat.value}
                </h3>
                <p className="text-gray-600 text-sm mt-1">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4 w-full lg:w-auto">
              <div className="relative flex-1 lg:flex-none w-96 lg:w-140">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search companies, industries, or emails..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
                />
              </div>
            </div>
          </div>

          {/* <div className="flex items-center gap-4 w-full lg:w-auto">
              <div className="relative">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="trial">Trial</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                  className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all cursor-pointer"
                >
                  <option value="all">All Plans</option>
                  <option value="Enterprise">Enterprise</option>
                  <option value="Professional">Professional</option>
                  <option value="Starter">Starter</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
              </div>

              <button className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                <Filter className="h-5 w-5 text-gray-600" />
                More Filters
              </button>

              <button className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                <Download className="h-5 w-5 text-gray-600" />
                Export
              </button>

              <div className="flex border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-4 py-3 ${viewMode === "grid" ? "bg-gray-100" : "bg-white"} hover:bg-gray-50 transition-colors cursor-pointer`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-4 py-3 ${viewMode === "list" ? "bg-gray-100" : "bg-white"} hover:bg-gray-50 transition-colors cursor-pointer`}
                >
                  List
                </button>
              </div>
            </div> */}
        </div>

        {/* Companies Grid/List View */}
        {/* Use the new CompaniesList component */}
        <div className="mt-6">
          <CompaniesList />
        </div>

      </main >

      {/* Footer Stats */}
      < footer className="px-6 py-4 border-t border-gray-200 bg-white" >
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-6">
            <span>
              Showing {filteredCompanies.length} of {companies.length} companies
            </span>
            <span className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Platform Health:{" "}
              <span className="text-emerald-600 font-medium">Excellent</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span>Average Satisfaction: {stats.averageRating}/5</span>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium">
              Last updated: Today
            </span>
          </div>
        </div>
      </footer >
    </div >
  );
};

export default Dashboard;
