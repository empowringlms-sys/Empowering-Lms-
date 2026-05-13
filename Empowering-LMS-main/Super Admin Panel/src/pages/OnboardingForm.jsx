import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Building,
  User,
  Mail,
  Phone,
  MapPin,
  Users,
  Globe,
  FileText,
  ChevronRight,
  CheckCircle,
  X,
  Loader2,
  Sparkles,
} from "lucide-react";

const OnboardingForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Company Information
    companyName: "",
    companyLogo: null,
    companyLogoPreview: null,
    companyDescription: "",
    industry: "",
    country: "",
    companyAddress: "",
    registrationNumber: "",
    estimatedLearners: "",
    referralSource: "",
    
    // Account Owner Information
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const industries = [
    "Education & Training",
    "Corporate Training",
    "Healthcare & Medical",
    "Technology & IT",
    "Finance & Banking",
    "Manufacturing",
    "Retail & E-commerce",
    "Hospitality & Tourism",
    "Government & Public Sector",
    "Non-Profit & NGO",
    "Other",
  ];

  const countries = [
    "United States",
    "Canada",
    "United Kingdom",
    "Australia",
    "Germany",
    "France",
    "India",
    "Singapore",
    "Japan",
    "Brazil",
    "Other",
  ];

  const referralSources = [
    "Google Search",
    "Social Media",
    "Recommendation",
    "Email Newsletter",
    "Webinar/Event",
    "Blog/Article",
    "Partner Referral",
    "Other",
  ];

  const steps = [
    { number: 1, title: "Company Details", icon: <Building className="h-5 w-5" /> },
    { number: 2, title: "Account Setup", icon: <User className="h-5 w-5" /> },
    { number: 3, title: "Review & Submit", icon: <CheckCircle className="h-5 w-5" /> },
  ];

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === "file") {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({
            ...prev,
            companyLogo: file,
            companyLogoPreview: reader.result
          }));
        };
        reader.readAsDataURL(file);
        
        // Clear file error if any
        if (errors.companyLogo) {
          setErrors(prev => ({ ...prev, companyLogo: "" }));
        }
      }
      return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.companyName.trim()) newErrors.companyName = "Company name is required";
      if (!formData.companyLogo) newErrors.companyLogo = "Company logo is required";
      if (!formData.industry) newErrors.industry = "Please select an industry";
      if (!formData.country) newErrors.country = "Please select a country";
      if (!formData.estimatedLearners) newErrors.estimatedLearners = "Please estimate number of learners";
    } else if (step === 2) {
      if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
      if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
      if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
      if (!formData.password) newErrors.password = "Password is required";
      if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateStep(3)) {
      setIsSubmitting(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setCurrentStep(1);
        setFormData({
          companyName: "",
          companyLogo: null,
          companyLogoPreview: null,
          companyDescription: "",
          industry: "",
          country: "",
          companyAddress: "",
          registrationNumber: "",
          estimatedLearners: "",
          referralSource: "",
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          password: "",
          confirmPassword: "",
        });
        setSubmitSuccess(false);
      }, 3000);
    }
  };

  const removeLogo = () => {
    setFormData(prev => ({
      ...prev,
      companyLogo: null,
      companyLogoPreview: null
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  errors.companyName
                    ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-100"
                }`}
                placeholder="Enter your company name"
              />
              {errors.companyName && (
                <p className="mt-2 text-sm text-red-600">{errors.companyName}</p>
              )}
            </div>

            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Company Logo *
              </label>
              {formData.companyLogoPreview ? (
                <div className="relative">
                  <div className="w-32 h-32 border-2 border-dashed border-emerald-200 rounded-xl overflow-hidden bg-emerald-50">
                    <img
                      src={formData.companyLogoPreview}
                      alt="Company logo preview"
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={removeLogo}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current.click()}
                  className={`cursor-pointer border-2 border-dashed rounded-xl p-8 text-center transition-all hover:border-emerald-500 hover:bg-emerald-50 ${
                    errors.companyLogo
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                >
                  <Upload className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-1">
                    <span className="text-emerald-600 font-medium">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                </div>
              )}
              {errors.companyLogo && (
                <p className="mt-2 text-sm text-red-600">{errors.companyLogo}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Company Description
              </label>
              <textarea
                name="companyDescription"
                value={formData.companyDescription}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all resize-none"
                placeholder="Brief description of your company"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Industry *
                </label>
                <div className="relative">
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-xl appearance-none focus:outline-none focus:ring-2 transition-all cursor-pointer ${
                      errors.industry
                        ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                        : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-100"
                    }`}
                  >
                    <option value="">Select Industry</option>
                    {industries.map((industry) => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </select>
                  <ChevronRight className="absolute right-4 top-1/2 transform -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" />
                </div>
                {errors.industry && (
                  <p className="mt-2 text-sm text-red-600">{errors.industry}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Country *
                </label>
                <div className="relative">
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-xl appearance-none focus:outline-none focus:ring-2 transition-all cursor-pointer ${
                      errors.country
                        ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                        : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-100"
                    }`}
                  >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                  <Globe className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                {errors.country && (
                  <p className="mt-2 text-sm text-red-600">{errors.country}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Company Address
              </label>
              <textarea
                name="companyAddress"
                value={formData.companyAddress}
                onChange={handleChange}
                rows="2"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all resize-none"
                placeholder="Full company address"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Company Registration Number
                </label>
                <input
                  type="text"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
                  placeholder="e.g., REG123456"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Estimated Number of Learners *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="estimatedLearners"
                    value={formData.estimatedLearners}
                    onChange={handleChange}
                    min="1"
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 transition-all pl-12 ${
                      errors.estimatedLearners
                        ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                        : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-100"
                    }`}
                    placeholder="Enter estimated learners"
                  />
                  <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                {errors.estimatedLearners && (
                  <p className="mt-2 text-sm text-red-600">{errors.estimatedLearners}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                How did you hear about us?
              </label>
              <div className="relative">
                <select
                  name="referralSource"
                  value={formData.referralSource}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all cursor-pointer"
                >
                  <option value="">Select Source</option>
                  {referralSources.map((source) => (
                    <option key={source} value={source}>
                      {source}
                    </option>
                  ))}
                </select>
                <FileText className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    errors.firstName
                      ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                      : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-100"
                  }`}
                  placeholder="Enter first name"
                />
                {errors.firstName && (
                  <p className="mt-2 text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    errors.lastName
                      ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                      : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-100"
                  }`}
                  placeholder="Enter last name"
                />
                {errors.lastName && (
                  <p className="mt-2 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 transition-all pl-12 ${
                    errors.email
                      ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                      : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-100"
                  }`}
                  placeholder="Enter email address"
                />
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Phone Number *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 transition-all pl-12 ${
                    errors.phoneNumber
                      ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                      : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-100"
                  }`}
                  placeholder="+1 (555) 123-4567"
                />
                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              {errors.phoneNumber && (
                <p className="mt-2 text-sm text-red-600">{errors.phoneNumber}</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    errors.password
                      ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                      : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-100"
                  }`}
                  placeholder="Create a password"
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                )}
                <p className="mt-2 text-xs text-gray-500">Minimum 8 characters</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    errors.confirmPassword
                      ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                      : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-100"
                  }`}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
                <h3 className="text-lg font-semibold text-emerald-800">
                  Review Your Information
                </h3>
              </div>
              <p className="text-sm text-emerald-700">
                Please review all details before submitting. You can go back to make changes if needed.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Building className="h-5 w-5 text-emerald-600" />
                  Company Details
                </h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Company Name</p>
                    <p className="font-medium text-gray-800">{formData.companyName || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Industry</p>
                    <p className="font-medium text-gray-800">{formData.industry || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Country</p>
                    <p className="font-medium text-gray-800">{formData.country || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Estimated Learners</p>
                    <p className="font-medium text-gray-800">{formData.estimatedLearners || "Not provided"}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                  <User className="h-5 w-5 text-emerald-600" />
                  Account Owner
                </h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium text-gray-800">
                      {formData.firstName} {formData.lastName || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-800">{formData.email || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-800">{formData.phoneNumber || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Referral Source</p>
                    <p className="font-medium text-gray-800">{formData.referralSource || "Not provided"}</p>
                  </div>
                </div>
              </div>
            </div>

            {formData.companyLogoPreview && (
              <div className="pt-4 border-t border-gray-100">
                <h4 className="font-semibold text-gray-800 mb-3">Logo Preview</h4>
                <div className="w-24 h-24 border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                  <img
                    src={formData.companyLogoPreview}
                    alt="Company logo"
                    className="w-full h-full object-contain p-2"
                  />
                </div>
              </div>
            )}

            <div className="bg-gray-50 rounded-xl p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">
                  I agree to the{" "}
                  <a href="#" className="text-emerald-600 hover:text-emerald-700 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-emerald-600 hover:text-emerald-700 hover:underline">
                    Privacy Policy
                  </a>
                  . I confirm that I have the authority to create this account on behalf of my organization.
                </span>
              </label>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border border-emerald-200 rounded-full text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4 text-emerald-500" />
            <span className="text-emerald-700 font-semibold">Welcome to Empowerings LMS</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Complete Your <span className="text-emerald-600">Onboarding</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Set up your organization's account in just a few steps. All fields marked with * are required.
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      currentStep >= step.number
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : "bg-white border-gray-300 text-gray-400"
                    } ${currentStep === step.number ? "ring-4 ring-emerald-100 scale-110" : ""}`}
                  >
                    {step.icon}
                  </div>
                  <span
                    className={`mt-2 text-sm font-medium ${
                      currentStep >= step.number ? "text-emerald-600" : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 transition-all duration-300 ${
                      currentStep > step.number ? "bg-emerald-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
        >
          <form onSubmit={handleSubmit}>
            <div className="p-8">
              <AnimatePresence mode="wait">
                {renderStepContent()}
              </AnimatePresence>
            </div>

            {/* Form Actions */}
            <div className="px-8 py-6 bg-gray-50 border-t border-gray-100">
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentStep === 1 || isSubmitting}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${
                    currentStep === 1 || isSubmitting
                      ? "opacity-50 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100 cursor-pointer"
                  }`}
                >
                  Back
                </button>

                {currentStep < steps.length ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className="group px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span>Continue</span>
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting || submitSuccess}
                    className="group px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <div className="flex items-center justify-center gap-2">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : submitSuccess ? (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          <span>Success!</span>
                        </>
                      ) : (
                        <>
                          <span>Complete Onboarding</span>
                          <CheckCircle className="h-4 w-4 group-hover:scale-110 transition-transform" />
                        </>
                      )}
                    </div>
                  </button>
                )}
              </div>
            </div>
          </form>
        </motion.div>

        {/* Success Message */}
        <AnimatePresence>
          {submitSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-6 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold text-emerald-800">Onboarding Complete!</h3>
                  <p className="text-emerald-700 text-sm mt-1">
                    Your organization has been successfully registered. You'll be redirected to your dashboard shortly.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Progress */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span>
              Step {currentStep} of {steps.length}
            </span>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      </div>
    </div>
  );
};

export default OnboardingForm;