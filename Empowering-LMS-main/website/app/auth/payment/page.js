"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import toast from "react-hot-toast";

const PaymentPage = () => {
    const router = useRouter();
    const { authToken } = useAuthContext();
    const [selectedPlan, setSelectedPlan] = useState("monthly"); // monthly, yearly, custom
    const [customMonths, setCustomMonths] = useState(2);
    const [isLoading, setIsLoading] = useState(false);

    const handlePayment = async () => {
        try {
            setIsLoading(true);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/create-checkout-session`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    planType: selectedPlan,
                    customMonths: selectedPlan === "custom" ? customMonths : undefined,
                }),
            });
            const data = await res.json();

            if (data.success) {
                window.location.href = data.url;
            } else {
                toast.error(data.message || "Payment initiation failed");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const calculateCustomPrice = () => {
        // Logic: 1 month free. 
        if (customMonths <= 1) return 0;
        return (customMonths - 1) * 20;
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
            <div className="max-w-4xl w-full space-y-8">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Choose Your Subscription Plan
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Select a plan that fits your needs.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    {/* Monthly Plan */}
                    <div
                        className={`cursor-pointer border-2 rounded-lg p-6 flex flex-col justify-between transition-all ${selectedPlan === "monthly" ? "border-indigo-600 bg-white shadow-lg scale-105" : "border-gray-200 bg-white hover:border-indigo-300"}`}
                        onClick={() => setSelectedPlan("monthly")}
                    >
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Monthly Plan</h3>
                            <p className="text-gray-500 text-sm mt-1">First Month Free</p>
                            <div className="mt-4">
                                <span className="text-4xl font-bold text-gray-900">$20</span>
                                <span className="text-base font-medium text-gray-500">/mo</span>
                            </div>
                            <p className="mt-4 text-sm text-gray-500">
                                Start with a 1-month free trial, then $20/month.
                            </p>
                        </div>
                        <div className={`mt-6 w-full h-4 rounded-full ${selectedPlan === "monthly" ? "bg-indigo-600" : "bg-gray-200"}`}></div>
                    </div>

                    {/* Yearly Plan */}
                    <div
                        className={`cursor-pointer border-2 rounded-lg p-6 flex flex-col justify-between transition-all ${selectedPlan === "yearly" ? "border-indigo-600 bg-white shadow-lg scale-105" : "border-gray-200 bg-white hover:border-indigo-300"}`}
                        onClick={() => setSelectedPlan("yearly")}
                    >
                        <div className="absolute top-0 right-0 -mt-2 -mr-2 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full transform rotate-12">
                            BEST VALUE
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Yearly Plan</h3>
                            <p className="text-gray-500 text-sm mt-1">1 Month Free</p>
                            <div className="mt-4">
                                <span className="text-4xl font-bold text-gray-900">$220</span>
                                <span className="text-base font-medium text-gray-500">/year</span>
                            </div>
                            <p className="mt-4 text-sm text-gray-500">
                                Pay for 11 months, get 12 months access. Save $20.
                            </p>
                        </div>
                        <div className={`mt-6 w-full h-4 rounded-full ${selectedPlan === "yearly" ? "bg-indigo-600" : "bg-gray-200"}`}></div>
                    </div>

                    {/* Custom Plan */}
                    <div
                        className={`cursor-pointer border-2 rounded-lg p-6 flex flex-col justify-between transition-all ${selectedPlan === "custom" ? "border-indigo-600 bg-white shadow-lg scale-105" : "border-gray-200 bg-white hover:border-indigo-300"}`}
                        onClick={() => setSelectedPlan("custom")}
                    >
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Custom Plan</h3>
                            <p className="text-gray-500 text-sm mt-1">Select Duration</p>

                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700">Months</label>
                                <input
                                    type="number"
                                    min="2"
                                    value={customMonths}
                                    onChange={(e) => setCustomMonths(parseInt(e.target.value))}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    onClick={(e) => e.stopPropagation()} // Prevent card click
                                />
                            </div>

                            <div className="mt-4">
                                <span className="text-4xl font-bold text-gray-900">${calculateCustomPrice()}</span>
                                <span className="text-base font-medium text-gray-500"> total</span>
                            </div>
                            <p className="mt-4 text-sm text-gray-500">
                                Pay for {customMonths > 1 ? customMonths - 1 : 0} months, get 1 month free.
                            </p>
                        </div>
                        <div className={`mt-6 w-full h-4 rounded-full ${selectedPlan === "custom" ? "bg-indigo-600" : "bg-gray-200"}`}></div>
                    </div>
                </div>

                <button
                    onClick={handlePayment}
                    disabled={isLoading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    {isLoading ? "Processing..." : "Proceed to Payment"}
                </button>
            </div>
        </div>
    );
};

export default PaymentPage;
