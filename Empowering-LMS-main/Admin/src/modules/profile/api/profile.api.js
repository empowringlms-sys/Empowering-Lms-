import api from "../../auth/services/auth.api";

export const getProfile = async () => {
    const response = await api.get("/api/profile");
    return response.data;
};

export const updateProfile = async (formData) => {
    // Expect formData to be a plain object now, not FormData instance
    const response = await api.put("/api/profile", formData);
    return response.data;
};
