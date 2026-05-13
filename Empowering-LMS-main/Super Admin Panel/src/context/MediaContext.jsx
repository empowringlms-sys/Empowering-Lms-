import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
    useRef,
} from "react";
import toast from "react-hot-toast";
import { useAuth } from "../modules/auth/context/AuthContext";
import api from "../services/courseApi";

const MediaContext = createContext();

export const useMedia = () => useContext(MediaContext);

export const MediaProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();

    // State for data storage
    const [mediaFiles, setMediaFiles] = useState([]);
    const [stats, setStats] = useState({
        total: { totalFiles: 0, totalSize: 0 },
        byType: [],
    });
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        pages: 1,
        limit: 10,
        total: 0,
    });
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredFiles, setFilteredFiles] = useState([]);
    const [initialLoadDone, setInitialLoadDone] = useState(false);

    // Use ref to track if initialization has already been done
    const hasInitialized = useRef(false);
    const toastShown = useRef(false);

    const addMediaFile = (file) => {
        setMediaFiles((prev) => [file, ...prev]);
    };

    // Search function
    const searchFiles = useCallback(
        (query) => {
            if (!query.trim()) {
                setFilteredFiles(mediaFiles);
                return;
            }

            const searchTerm = query.toLowerCase();
            const results = mediaFiles.filter(
                (file) =>
                    file.name.toLowerCase().includes(searchTerm) ||
                    file.type.toLowerCase().includes(searchTerm) ||
                    file.extension.toLowerCase().includes(searchTerm)
            );

            setFilteredFiles(results);
        },
        [mediaFiles]
    );

    // Initialize data from API - only once
    const initializeData = useCallback(
        async (showToast = true) => {
            // Prevent multiple initializations (but allow if we just reset due to login)
            if (hasInitialized.current) return;

            setLoading(true);
            try {
                const [filesResponse, statsResponse] = await Promise.all([
                    api.get("/media-files", { params: { page: 1, limit: 100 } }),
                    api.get("/media-files/stats"),
                ]);

                if (filesResponse.data.success && statsResponse.data.success) {
                    const filesData = filesResponse.data.data.files;
                    const statsData = statsResponse.data.data;
                    const paginationData = filesResponse.data.data.pagination;

                    setMediaFiles(filesData);
                    setFilteredFiles(filesData);
                    setStats(statsData);
                    setPagination(paginationData);

                    // Only show toast if requested and not already shown
                    if (showToast && !toastShown.current) {
                        // toast.success("Files loaded successfully");
                        toastShown.current = true;
                    }

                    // Mark as initialized
                    hasInitialized.current = true;
                }
            } catch (error) {
                console.error("Error initializing data:", error);
                if (showToast) {
                    toast.error("Failed to load files");
                }
            } finally {
                setLoading(false);
                setInitialLoadDone(true);
            }
        },
        []
    );

    // Auth State Effect: Handle Login/Logout
    useEffect(() => {
        // Basic check for auth token in cookies usually handled by api client + backend, 
        // but here we check context state.
        // SuperAdmin auth context might differ slightly, but assuming isAuthenticated is boolean.

        if (isAuthenticated) {
            // User is logged in
            if (!initialLoadDone && !hasInitialized.current) {
                initializeData(false); // Don't show toast on initial auto-load to avoid spam
            }
        } else {
            // User is logged out - CLEAR STATE
            setMediaFiles([]);
            setFilteredFiles([]);
            setStats({
                total: { totalFiles: 0, totalSize: 0 },
                byType: [],
            });
            setPagination({
                page: 1,
                pages: 1,
                limit: 10,
                total: 0,
            });
            setInitialLoadDone(false);
            hasInitialized.current = false;
            toastShown.current = false;
        }
    }, [isAuthenticated, initializeData, initialLoadDone]);

    // Fetch all files with pagination
    const fetchFiles = useCallback(
        async (page = 1, type = null) => {
            setLoading(true);
            try {
                const params = { page, limit: 10 };
                if (type) params.type = type;

                const response = await api.get("/media-files", { params });

                if (response.data.success) {
                    const newFiles = response.data.data.files;
                    setMediaFiles(newFiles);
                    setFilteredFiles(newFiles);
                    setPagination(response.data.data.pagination);
                }
            } catch (error) {
                console.error("Error fetching files:", error);
                toast.error("Failed to fetch files");
            } finally {
                setLoading(false);
            }
        },
        []
    );

    // Fetch statistics
    const fetchStats = useCallback(async () => {
        try {
            const response = await api.get("/media-files/stats");
            if (response.data.success) {
                setStats(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching stats:", error);
            toast.error("Failed to fetch statistics");
        }
    }, []);

    // Upload single file
    const uploadFile = async (file) => {
        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await api.post("/media-files/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data.success) {
                // Add to state
                const newFile = response.data.data;
                const updatedFiles = [newFile, ...mediaFiles];
                setMediaFiles(updatedFiles);
                setFilteredFiles(updatedFiles);

                // Update stats
                await fetchStats();

                return { success: true, data: newFile };
            }
            return { success: false, message: response.data.message };
        } catch (error) {
            console.error("Error uploading file:", error);
            return {
                success: false,
                message: error.response?.data?.message || "Upload failed",
            };
        }
    };

    // Upload multiple files
    const uploadMultipleFiles = async (files) => {
        try {
            const formData = new FormData();
            files.forEach((file) => {
                formData.append("files", file);
            });

            const response = await api.post(
                "/media-files/upload-multiple",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            if (response.data.success) {
                const newFiles = response.data.data.successful;
                const updatedFiles = [...newFiles, ...mediaFiles];
                setMediaFiles(updatedFiles);
                setFilteredFiles(updatedFiles);

                // Update stats
                await fetchStats();

                return { success: true, data: response.data.data };
            }
            return { success: false, message: response.data.message };
        } catch (error) {
            console.error("Error uploading files:", error);
            return {
                success: false,
                message: error.response?.data?.message || "Upload failed",
            };
        }
    };

    // Delete file
    const deleteFile = async (fileId) => {
        try {
            const response = await api.delete(`/media-files/${fileId}`);

            if (response.data.success) {
                // Remove from state
                const updatedFiles = mediaFiles.filter((file) => file._id !== fileId);
                setMediaFiles(updatedFiles);
                setFilteredFiles(updatedFiles);

                // Update stats
                await fetchStats();

                return { success: true };
            }
            return { success: false, message: response.data.message };
        } catch (error) {
            console.error("Error deleting file:", error);
            return {
                success: false,
                message: error.response?.data?.message || "Delete failed",
            };
        }
    };

    // Update file name
    const updateFileName = async (fileId, newName) => {
        try {
            const response = await api.patch(
                `/media-files/${fileId}/name`,
                { name: newName }
            );

            if (response.data.success) {
                // Update in state
                const updatedFiles = mediaFiles.map((file) =>
                    file._id === fileId ? { ...file, name: newName } : file
                );
                setMediaFiles(updatedFiles);
                setFilteredFiles(updatedFiles);

                return { success: true, data: response.data.data };
            }
            return { success: false, message: response.data.message };
        } catch (error) {
            console.error("Error updating file name:", error);
            return {
                success: false,
                message: error.response?.data?.message || "Update failed",
            };
        }
    };

    // Refresh data (force update from server)
    const refreshData = async () => {
        setLoading(true);
        try {
            const [filesResponse, statsResponse] = await Promise.all([
                api.get("/media-files", { params: { page: 1, limit: 100 } }),
                api.get("/media-files/stats"),
            ]);

            if (filesResponse.data.success && statsResponse.data.success) {
                const filesData = filesResponse.data.data.files;
                const statsData = statsResponse.data.data;
                const paginationData = filesResponse.data.data.pagination;

                setMediaFiles(filesData);
                setFilteredFiles(filesData);
                setStats(statsData);
                setPagination(paginationData);

                toast.success("Files refreshed successfully");
            }
        } catch (error) {
            console.error("Error refreshing data:", error);
            toast.error("Failed to refresh files");
        } finally {
            setLoading(false);
        }
    };

    // Effect to search when query changes
    useEffect(() => {
        if (initialLoadDone) {
            searchFiles(searchQuery);
        }
    }, [searchQuery, searchFiles, initialLoadDone]);

    const value = {
        mediaFiles: filteredFiles,
        stats,
        loading,
        pagination,
        searchQuery,
        setSearchQuery,
        fetchFiles,
        fetchStats,
        uploadFile,
        uploadMultipleFiles,
        deleteFile,
        updateFileName,
        refreshData,
        initializeData,
        initialLoadDone,
        addMediaFile,
    };

    return (
        <MediaContext.Provider value={value}>{children}</MediaContext.Provider>
    );
};
