import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosInstance/axiosInstance";
import { useAuthContext } from "../../userAuth/AuthContext";

const ProfileContext = createContext();

export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error("useProfile must be used within a ProfileProvider");
    }
    return context;
};

export const ProfileProvider = ({ children }) => {
    const { isLogin } = useAuthContext();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("/users/profile/me");
            if (res.data?.success) {
                const userData = res.data.data.user;
                setProfile(userData);
                return userData;
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isLogin) {
            fetchProfile();
        } else {
            setProfile(null);
            setLoading(false);
        }
    }, [isLogin]);

    const isProfileComplete = profile && (
        profile.name &&
        profile.contactNo
    );

    const value = {
        profile,
        loading,
        fetchProfile,
        isProfileComplete
    };

    return (
        <ProfileContext.Provider value={value}>
            {children}
        </ProfileContext.Provider>
    );
};
