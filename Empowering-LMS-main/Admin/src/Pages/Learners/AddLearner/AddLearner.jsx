import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    FiArrowLeft,
    FiUser,
    FiMail,
    FiPhone,
    FiLock,
    FiBook,
    FiImage,
    FiCheck,
    FiSave,
} from "react-icons/fi";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import axiosInstance from "../../../../utils/axiosInstance";

import useMediaPicker from "../../../modules/media-files/useMediaPicker";
import MediaPickerModal from "../../../modules/media-files/MediaPickerModal";

const AddLearner = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetchingCourses, setFetchingCourses] = useState(false);
    const [courses, setCourses] = useState([]);
    const { isOpen: isMediaOpen, openMediaPicker, closeMediaPicker, config: mediaConfig } = useMediaPicker();

    const [formData, setFormData] = useState({
        name: "Ahmad",
        email: "developerahmad3@gmail.com",
        password: "password",
        contactNo: "1234567890",
        courses: [],
        avatar: "",
    });

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setFetchingCourses(true);
            const response = await axiosInstance.get("/courses/names");
            if (response?.data?.success) {
                setCourses(response.data.data.courses || []);
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
            toast.error("Failed to load courses");
        } finally {
            setFetchingCourses(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectImage = async () => {
        try {
            const result = await openMediaPicker({
                allowedTypes: "image",
                title: "Select Profile Picture",
                multiSelect: false,
            });

            if (result) {
                // Assuming result has 'url' or 'src' property. Looking at MediaPickerModal, it calls onSelect(file).
                // file usually has 'url' or 'src'. I will check MediaPickerModal usage or just inspect the object if possible.
                // Based on renderFilePreview in MediaPickerModal, it uses `file.src`.
                setFormData(prev => ({ ...prev, avatar: result.src || result.url }));
            }
        } catch (e) {
            // cancelled
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
            };

            const response = await axiosInstance.post("/users/create", payload);

            if (response?.data?.success) {
                toast.success("Learner created successfully!");
                navigate("/learners");
            }
        } catch (error) {
            console.error("Error creating learner:", error);
            toast.error(error?.response?.data?.message || "Failed to create learner");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-50/30 to-white p-3 sm:p-4 md:p-6">
            <MediaPickerModal
                isOpen={isMediaOpen}
                onClose={closeMediaPicker}
                onSelect={mediaConfig.onSelect}
                allowedTypes={mediaConfig.allowedTypes}
                title={mediaConfig.title}
                multiSelect={mediaConfig.multiSelect}
            />

            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => navigate("/learners")}
                        className="flex items-center justify-center w-10 h-10 bg-emerald-50 text-emerald-700 font-medium rounded-xl hover:bg-emerald-100 transition-all duration-200 cursor-pointer"
                    >
                        <FiArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-2xl font-bold text-emerald-900">Add New Learner</h1>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden p-6"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Avatar Section */}
                        <div>
                            <label className="block text-sm font-medium text-emerald-900 mb-2">Profile Picture</label>
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center overflow-hidden border-2 border-emerald-200 shrink-0">
                                    {formData.avatar ? (
                                        <img src={formData.avatar} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <FiImage className="w-8 h-8 text-emerald-400" />
                                    )}
                                </div>
                                <div>
                                    <button
                                        type="button"
                                        onClick={handleSelectImage}
                                        className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg cursor-pointer hover:bg-emerald-100 transition-colors inline-block font-medium text-sm"
                                    >
                                        Select Image
                                    </button>
                                    <p className="text-xs text-emerald-500 mt-1">Recommended: Circular image</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-emerald-900 mb-1.5">Full Name</label>
                                <div className="relative">
                                    <FiUser className="absolute left-3 top-3.5 text-emerald-400" />
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-white border border-emerald-200 rounded-xl focus:border-emerald-400 focus:ring-3 focus:ring-emerald-100 focus:outline-none transition-all text-emerald-900"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-emerald-900 mb-1.5">Email Address</label>
                                <div className="relative">
                                    <FiMail className="absolute left-3 top-3.5 text-emerald-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-white border border-emerald-200 rounded-xl focus:border-emerald-400 focus:ring-3 focus:ring-emerald-100 focus:outline-none transition-all text-emerald-900"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-emerald-900 mb-1.5">Password</label>
                                <div className="relative">
                                    <FiLock className="absolute left-3 top-3.5 text-emerald-400" />
                                    <input
                                        type="text"
                                        name="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-white border border-emerald-200 rounded-xl focus:border-emerald-400 focus:ring-3 focus:ring-emerald-100 focus:outline-none transition-all text-emerald-900"
                                        placeholder="Secret Password"
                                    />
                                </div>
                            </div>

                            {/* Contact */}
                            <div>
                                <label className="block text-sm font-medium text-emerald-900 mb-1.5">Contact Number</label>
                                <div className="relative">
                                    <FiPhone className="absolute left-3 top-3.5 text-emerald-400" />
                                    <input
                                        type="number"
                                        name="contactNo"
                                        value={formData.contactNo}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-white border border-emerald-200 rounded-xl focus:border-emerald-400 focus:ring-3 focus:ring-emerald-100 focus:outline-none transition-all text-emerald-900"
                                        placeholder="+1 234 567 890"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Courses Selection */}
                        <div>
                            <label className="block text-sm font-medium text-emerald-900 mb-1.5">Enroll in Courses</label>
                            <div className="relative">
                                <div className="grid grid-cols-1 gap-3">
                                    {courses.map((course) => (
                                        <div
                                            key={course._id}
                                            onClick={() => {
                                                const isSelected = formData.courses.includes(course._id);
                                                let newCourses;
                                                if (isSelected) {
                                                    newCourses = formData.courses.filter(id => id !== course._id);
                                                } else {
                                                    newCourses = [...formData.courses, course._id];
                                                }
                                                setFormData(prev => ({ ...prev, courses: newCourses }));
                                            }}
                                            className={`
                                                relative flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200
                                                ${formData.courses.includes(course._id)
                                                    ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500'
                                                    : 'bg-white border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50/50'
                                                }
                                            `}
                                        >
                                            <div className={`
                                                w-5 h-5 rounded-md border flex items-center justify-center transition-colors
                                                ${formData.courses.includes(course._id)
                                                    ? 'bg-emerald-500 border-emerald-500 text-white'
                                                    : 'border-emerald-300 bg-white'
                                                }
                                            `}>
                                                {formData.courses.includes(course._id) && <FiCheck className="w-3.5 h-3.5" />}
                                            </div>
                                            <span className={`text-sm font-medium ${formData.courses.includes(course._id) ? 'text-emerald-900' : 'text-gray-600'}`}>
                                                {course.courseName}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                {courses.length === 0 && !fetchingCourses && (
                                    <p className="text-sm text-gray-500 italic p-2">No courses available.</p>
                                )}
                            </div>
                            {fetchingCourses && <p className="text-xs text-emerald-500 mt-1">Loading courses...</p>}
                        </div>

                        <div className="pt-4 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => navigate("/learners")}
                                className="px-6 py-2.5 bg-emerald-50 text-emerald-700 font-medium rounded-xl hover:bg-emerald-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Creating...</span>
                                    </>
                                ) : (
                                    <>
                                        <FiCheck className="w-5 h-5" />
                                        <span>Create Learner</span>
                                    </>
                                )}
                            </button>
                        </div>

                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default AddLearner;
