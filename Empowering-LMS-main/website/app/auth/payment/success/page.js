"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { navigateToAdminPanel } from "../../../../utils/adminNavigation";

const SuccessContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { authToken, setUserData } = useAuthContext();
    const [status, setStatus] = useState("verifying"); // verifying, success, error
    const [message, setMessage] = useState("Verifying your payment...");

    useEffect(() => {
        const verifyPayment = async () => {
            const sessionId = searchParams.get("session_id");

            if (!sessionId) {
                setStatus("error");
                setMessage("Invalid session. No payment information found.");
                return;
            }

            if (!authToken) {
                // If not logged in, we can't verify properly via API that requires auth
                // But if they just paid, they should be logged in.
                // If not, redirect to login?
                // Let's assume they are logged in or token is persisted.
                return;
            }

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/payment-success`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${authToken}`,
                    },
                    body: JSON.stringify({ session_id: sessionId }),
                });

                const data = await res.json();

                if (data.success || data.message === "Already processed") {
                    setStatus("success");
                    setMessage("Payment successful! Redirecting to dashboard...");

                    // Refresh user data to update subscription status in context
                    if (setUserData && data.data) {
                        setUserData(data.data);
                    }

                    // Auto redirect after 3 seconds
                    setTimeout(() => {
                        navigateToAdminPanel(authToken);
                    }, 3000);
                } else {
                    setStatus("error");
                    setMessage(data.message || "Payment verification failed.");
                }
            } catch (error) {
                console.error("Verification error:", error);
                setStatus("error");
                setMessage("An error occurred while verifying payment.");
            }
        };

        if (authToken) {
            verifyPayment();
        }
    }, [authToken, searchParams, router, setUserData]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                {status === "verifying" && (
                    <div className="flex flex-col items-center">
                        <Loader2 className="h-16 w-16 text-emerald-500 animate-spin mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Payment</h2>
                        <p className="text-gray-600">{message}</p>
                    </div>
                )}

                {status === "success" && (
                    <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
                        <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="h-10 w-10 text-emerald-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
                        <p className="text-gray-600 mb-6">{message}</p>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                            <div className="bg-emerald-500 h-1.5 rounded-full animate-progress" style={{ width: '100%' }}></div>
                        </div>
                        <p className="text-xs text-gray-400">Redirecting in a few seconds...</p>
                    </div>
                )}

                {status === "error" && (
                    <div className="flex flex-col items-center">
                        <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                            <AlertCircle className="h-10 w-10 text-red-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
                        <p className="text-gray-600 mb-6">{message}</p>
                        <div className="flex gap-4">
                            <Link
                                href="/pricing"
                                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Try Again
                            </Link>
                            <Link
                                href="/contact-us"
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Contact Support
                            </Link>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
};

export default function PaymentSuccess() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
            <SuccessContent />
        </Suspense>
    );
}
