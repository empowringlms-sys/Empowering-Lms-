import { useState, useEffect, useRef } from "react";
import { useAuth } from "../auth/context/AuthContext";
import { useProfile } from "./context/ProfileContext";
import MediaPickerModal from "../media-files/MediaPickerModal";
import useMediaPicker from "../media-files/useMediaPicker";
import { FiCamera, FiEdit2, FiSave, FiMapPin, FiPhone, FiGlobe, FiBriefcase, FiFileText, FiX, FiCheck } from "react-icons/fi";
import toast from "react-hot-toast";



export default function ProfilePage() {
    const { admin, checkAuth } = useAuth();
    const { profile, loading, updateProfile } = useProfile();
    const [saveLoading, setSaveLoading] = useState(false);

    const [initialData, setInitialData] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        industry: "",
        country: "",
        contactNo: "",
        address: "",
        registrationNo: "",
    });

    const [logoPreview, setLogoPreview] = useState(null);

    const { isOpen, config, openMediaPicker, closeMediaPicker } = useMediaPicker();

    // Load data when profile changes
    useEffect(() => {
        if (profile) {
            const data = {
                name: profile?.account?.name || admin?.account?.name || "",
                description: profile.description || "",
                industry: profile.industry || "",
                country: profile.country || "",
                contactNo: profile.contactNo || "",
                address: profile.address || "",
                registrationNo: profile.registrationNo || "",
            };
            setFormData(data);
            setInitialData(data); // Set initial data for comparison

            if (profile.logo) {
                setLogoPreview(profile.logo);
            }
        }
    }, [profile, admin]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleLogoSelect = async () => {
        const file = await openMediaPicker({
            allowedTypes: "image",
            title: "Select Company Logo",
        });

        if (file && file.src) {
            // Treat logo change as a form change
            // We can add a 'logo' field to formData even if it's not initially deep equal checked until saving
            setFormData(prev => ({ ...prev, logo: file.src }));
            setLogoPreview(file.src);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaveLoading(true);

        try {
            const res = await updateProfile(formData);
            if (res.success) {
                toast.success("Profile updated successfully");
                await checkAuth(); // Refresh admin data (name) from server
                setInitialData(formData); // Reset initial data to current form data
            }
        } catch (error) {
            console.error("Update failed", error);
            toast.error("Failed to update profile");
        } finally {
            setSaveLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-[1600px] mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Company Profile</h1>

            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden relative transition-all duration-300">
                <form onSubmit={handleSubmit} className="p-6 md:p-8">

                    <div className="flex flex-col md:flex-row gap-12">
                        {/* Left Column: Logo */}
                        <div className="w-full md:w-auto flex flex-col items-center">
                            <div className="relative group cursor-pointer" onClick={handleLogoSelect}>
                                <div className="w-40 h-40 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-50 flex items-center justify-center transition-transform transform group-hover:scale-105">
                                    {logoPreview ? (
                                        <img src={logoPreview} alt="Company Logo" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-4xl font-bold text-emerald-600">
                                            {(profile?.account?.name || admin?.account?.name)?.charAt(0).toUpperCase()}
                                        </span>
                                    )}

                                    {/* Overlay on hover */}
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <FiCamera className="text-white text-3xl" />
                                    </div>
                                </div>
                                <p className="mt-3 text-xs text-center text-gray-500 group-hover:text-emerald-600 transition-colors font-medium">Click to change logo</p>
                            </div>
                        </div>

                        {/* Right Column: Form Fields */}
                        <div className="flex-1 space-y-6">
                            {/* Company Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm"
                                    placeholder="Enter company name"
                                />
                                <p className="text-xs text-gray-400 mt-1">This name must be unique.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <span className="flex items-center gap-2"><FiBriefcase className="text-emerald-500" /> Industry</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="industry"
                                        value={formData.industry}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Education, Tech"
                                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <span className="flex items-center gap-2"><FiGlobe className="text-emerald-500" /> Country</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        placeholder="e.g. United States"
                                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <span className="flex items-center gap-2"><FiPhone className="text-emerald-500" /> Contact Number</span>
                                    </label>
                                    <input
                                        type="tel"
                                        name="contactNo"
                                        value={formData.contactNo}
                                        onChange={handleInputChange}
                                        placeholder="+1 234 567 890"
                                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <span className="flex items-center gap-2"><FiFileText className="text-emerald-500" /> Registration No</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="registrationNo"
                                        value={formData.registrationNo}
                                        onChange={handleInputChange}
                                        placeholder="Reg. No"
                                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <span className="flex items-center gap-2"><FiMapPin className="text-emerald-500" /> Address</span>
                                </label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    rows="2"
                                    placeholder="Full office address"
                                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none shadow-sm"
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="4"
                                    placeholder="Tell us about your company..."
                                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm"
                                ></textarea>
                            </div>

                            {/* Save Button - Only show if changes exist */}
                            {JSON.stringify(formData) !== JSON.stringify(initialData) && (
                                <div className="flex justify-end pt-6 border-t border-gray-100 animate-fade-in">
                                    <button
                                        type="submit"
                                        disabled={saveLoading}
                                        className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg cursor-pointer text-lg"
                                    >
                                        <FiSave className="text-xl" />
                                        {saveLoading ? "Saving Changes..." : "Save Changes"}
                                    </button>
                                </div>
                            )}

                        </div>
                    </div>
                </form>
            </div>

            <MediaPickerModal
                isOpen={isOpen}
                onClose={closeMediaPicker}
                onSelect={config.onSelect}
                allowedTypes={config.allowedTypes}
                title={config.title}
            />
        </div>
    );
}
