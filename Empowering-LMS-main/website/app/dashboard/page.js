"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "../../context/AuthContext";
import { navigateToAdminPanel } from "../../utils/adminNavigation";

export default function Dashboard() {
    const router = useRouter();
    const { isLogin, userData, isLoading, authToken } = useAuthContext();

    useEffect(() => {
        if (!isLoading) {
            if (!isLogin) {
                router.push("/auth/login");
            } else {
                if (userData?.subscription?.paymentCompleted) {
                    // Use window.location for external URL
                    // Use navigateToAdminPanel for external URL with SSO
                    navigateToAdminPanel(authToken);
                } else {
                    router.push("/pricing");
                }
            }
        }
    }, [isLogin, userData, isLoading, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 font-medium">Redirecting...</p>
            </div>
        </div>
    );
}
