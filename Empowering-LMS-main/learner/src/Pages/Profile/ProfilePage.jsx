import { useState, useEffect, useRef } from "react";
import { useAuthContext } from "../../modules/userAuth/AuthContext";
import { useProfile } from "../../modules/profile/context/ProfileContext";
import axiosInstance from "../../utils/axiosInstance/axiosInstance";
import { FiCamera, FiSave, FiPhone, FiUser, FiInfo } from "react-icons/fi";
import { toast } from "react-hot-toast";

export default function ProfilePage() {
    const { userData, updateUserData } = useAuthContext();
    const { fetchProfile } = useProfile();
    const [loading, setLoading] = useState(false);
    const [avatarLoading, setAvatarLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        contactNo: "",
        email: "",
    });

    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);

    // Cleanup preview URL on unmount
    useEffect(() => {
        return () => {
            if (avatarPreview) {
                URL.revokeObjectURL(avatarPreview);
            }
        };
    }, [avatarPreview]);

    const fileInputRef = useRef(null);

    // Initialize form with user data
    useEffect(() => {
        if (userData) {
            setFormData({
                name: userData.name || "",
                contactNo: userData.contactNo || "",
                email: userData.email || "", // Read-only
            });
        }
    }, [userData]);

    // Check if form has changes
    const isDirty = (userData ? (
        formData.name !== (userData.name || "") ||
        formData.contactNo !== (userData.contactNo || "")
    ) : false) || avatarFile !== null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (!file.type.startsWith("image/")) {
            toast.error("Please upload an image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB
            toast.error("Image size should be less than 5MB");
            return;
        }

        // Create preview
        const objectUrl = URL.createObjectURL(file);
        setAvatarPreview(objectUrl);
        setAvatarFile(file);

        // Reset input for re-selection
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = new FormData();
            payload.append("name", formData.name);
            payload.append("contactNo", formData.contactNo);

            if (avatarFile) {
                payload.append("avatar", avatarFile);
            }

            const res = await axiosInstance.put("/users/profile/me", payload, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (res.data?.success) {
                toast.success("Profile updated successfully");
                // Refetch profile context and get fresh data
                console.log("Fetching fresh profile data...");
                const freshUserData = await fetchProfile();
                console.log("Fresh user data received:", freshUserData);

                // Update local context with FRESH data to ensure sync
                if (freshUserData) {
                    console.log("Updating AuthContext with fresh data...");
                    updateUserData({ ...userData, ...freshUserData });
                } else {
                    console.error("Failed to fetch fresh user data!");
                }
                // Clear file state
                setAvatarFile(null);
                setAvatarPreview(null);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    if (!userData) return null;

    return (
        <div className="p-1 sm:p-3 max-w-[1200px] mx-auto">
            <h1 className="text-2xl font-bold text-emerald-900 mb-6">My Profile</h1>

            <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden">
                <form onSubmit={handleSubmit} className="p-6 md:p-10">
                    <div className="flex flex-col md:flex-row gap-12">

                        {/* Avatar Section */}
                        <div className="w-full md:w-auto flex flex-col items-center">
                            <div
                                className="relative group cursor-pointer"
                                onClick={!avatarLoading ? handleAvatarClick : undefined}
                            >
                                <div
                                    className={`w-40 h-40 rounded-full border-4 border-white shadow-lg overflow-hidden bg-emerald-50 flex items-center justify-center transition-transform duration-300 transform group-hover:scale-105 ${avatarLoading ? 'opacity-50' : ''}`}
                                    style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "translateZ(0)" }}
                                >
                                    {avatarPreview || userData.avatar ? (
                                        <img
                                            src={avatarPreview || userData.avatar}
                                            alt={userData.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-5xl font-bold text-emerald-600">
                                            {userData.name?.charAt(0).toUpperCase()}
                                        </span>
                                    )}

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <FiCamera className="text-white text-3xl" />
                                    </div>

                                    {/* Loading Spinner */}
                                    {avatarLoading && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600"></div>
                                        </div>
                                    )}
                                </div>
                                <p className="mt-3 text-sm text-center text-gray-500 group-hover:text-emerald-600 transition-colors font-medium">
                                    {avatarLoading ? "Uploading..." : "Change Profile Photo"}
                                </p>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                    accept="image/*"
                                />
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="flex-1 space-y-6">

                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-medium text-emerald-800 mb-2">
                                    <span className="flex items-center gap-2">
                                        <FiUser className="text-emerald-500" /> Full Name
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm text-gray-700"
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Email (Read Only) */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        readOnly
                                        disabled
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-400 cursor-not-allowed"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
                                </div>

                                {/* Contact No */}
                                <div>
                                    <label className="block text-sm font-medium text-emerald-800 mb-2">
                                        <span className="flex items-center gap-2">
                                            <FiPhone className="text-emerald-500" /> Contact Number
                                        </span>
                                    </label>
                                    <input
                                        type="number"
                                        name="contactNo"
                                        value={formData.contactNo}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm text-gray-700"
                                        placeholder="+1 234 567 890"
                                    />
                                </div>
                            </div>



                            {/* Save Button - Only show if dirty */}
                            {isDirty && (
                                <div className="flex justify-end pt-4 border-t border-gray-100">
                                    <button
                                        type="submit"
                                        disabled={loading || avatarLoading}
                                        className="
                                        flex items-center gap-2 px-8 py-3 
                                        bg-gradient-to-r from-emerald-500 to-emerald-600 
                                        text-white font-semibold rounded-xl 
                                        shadow-lg shadow-emerald-100
                                        hover:scale-[1.02] hover:shadow-xl
                                        active:scale-95
                                        disabled:opacity-70 disabled:cursor-not-allowed 
                                        transition-all duration-200 cursor-pointer
                                    "
                                    >
                                        <FiSave className="text-lg" />
                                        {loading ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            )}

                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
