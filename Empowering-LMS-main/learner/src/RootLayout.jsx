import { Outlet } from "react-router-dom";
import { AuthProvider } from "./modules/userAuth/AuthContext";
import { Toaster } from "react-hot-toast";
import { CompanyProfileProvider } from "./modules/CompanyProfile/CompanyProfileContext";
import { ProfileProvider } from "./modules/profile/context/ProfileContext";

const RootLayout = () => {
    return (
        <CompanyProfileProvider>
            <AuthProvider>
                <ProfileProvider>
                    <Outlet />
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 3000,
                            style: {
                                background: "#fff",
                                color: "#333",
                                border: "1px solid #d1fae5",
                                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                            },
                        }}
                    />
                </ProfileProvider>
            </AuthProvider>
        </CompanyProfileProvider>
    );
};

export default RootLayout;
