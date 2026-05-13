"use client";
import React from "react";
import { XCircle } from "lucide-react";
import Link from "next/link";

export default function PaymentCancel() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                <div className="flex flex-col items-center">
                    <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <XCircle className="h-10 w-10 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Cancelled</h2>
                    <p className="text-gray-600 mb-8">
                        Your payment was cancelled and no charges were made. You can try again whenever you're ready.
                    </p>

                    <div className="flex flex-col w-full gap-3">
                        <Link
                            href="/pricing"
                            className="w-full py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
                        >
                            Return to Pricing
                        </Link>
                        <Link
                            href="/"
                            className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                        >
                            Go Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
