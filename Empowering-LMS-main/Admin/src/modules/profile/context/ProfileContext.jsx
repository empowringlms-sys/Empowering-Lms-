import { createContext, useContext, useEffect, useState } from "react";
import { getProfile, updateProfile as updateProfileApi } from "../api/profile.api";
import { useAuth } from "../../auth/context/AuthContext";
import toast from "react-hot-toast";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
    const { isAuthenticated, admin } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);






    // Calculate if the profile is "complete" (has at least some key info)
    // Calculate if the profile is "complete" (has at least some key info)
    const isProfileComplete = profile && (
        profile.description ||
        profile.industry ||
        profile.country ||
        profile.contactNo ||
        profile.address ||
        profile.registrationNo ||
        profile.logo
    );

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const res = await getProfile();
            if (res.success && res.data) {
                // Store the full company object so we have access to account info if needed
                // We merge it so 'profile' property is reachable but also 'account'
                setProfile({
                    ...res.data.profile,
                    account: res.data.account,
                    learnerPanelUrl: res.learnerPanelUrl
                });
                // Also ensure admin context is synced if needed, 
                // but typically admin context holds the JWT payload or user object.
            } else {
                setProfile({}); // Set empty object instead of null to avoid errors
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
            // Do NOT toast error here to avoid annoying users on login
            setProfile({});
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (formData) => {
        const res = await updateProfileApi(formData);
        if (res.success) {
            setProfile({
                ...res.data.profile,
                account: res.data.account,
                learnerPanelUrl: res.learnerPanelUrl
            });
        }
        return res;
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchProfile();
        } else {
            setProfile(null);
            setLoading(false);
        }
    }, [isAuthenticated]);

    return (
        <ProfileContext.Provider value={{
            profile,
            loading,
            fetchProfile,
            updateProfile,
            isProfileComplete
        }}>
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfile = () => useContext(ProfileContext);
