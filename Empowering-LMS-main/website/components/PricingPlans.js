"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Calendar, Clock, Zap, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import toast from "react-hot-toast";

const PricingPlansContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { authToken, isLogin, userData } = useAuthContext();
  const [customMonths, setCustomMonths] = useState(2);
  const [loadingPlanId, setLoadingPlanId] = useState(null);

  /* Logic for Active Plan & Trial Eligibility */
  // Debugging user data
  console.log("PricingPlans: userData", userData, "hasUsedTrial", userData?.subscription?.hasUsedTrial);

  const activeSubscription = userData?.subscription?.paymentCompleted ? userData.subscription : null;
  const isPlanActive = activeSubscription && new Date(activeSubscription.expiresAt) > new Date();
  // robust check: if explicit flag is true OR if they have ever completed a payment
  const hasUsedTrial = userData?.subscription?.hasUsedTrial || userData?.subscription?.paymentCompleted || false;
  console.log("hasUsedTrial : ", hasUsedTrial)
  console.log("isPlanActive : ", isPlanActive)
  console.log("activeSubscription : ", activeSubscription)
  // Initial check for query params if redirecting back
  useEffect(() => {
    // 1. Check for standard 'months' param (rendering logic)
    const months = searchParams.get("months");
    if (months) setCustomMonths(parseInt(months));

    // 2. Check for checkout triggers (post-login redirect)
    const checkoutPlan = searchParams.get("checkout_plan");
    const checkoutMonths = searchParams.get("checkout_months");

    if (isLogin && checkoutPlan && !loadingPlanId) {
      if (checkoutMonths) {
        setCustomMonths(parseInt(checkoutMonths));
      }

      // Execute payment
      handlePayment(checkoutPlan);

      // Cleanup URL params to prevent loop/re-trigger on refresh
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("checkout_plan");
      newParams.delete("checkout_months");
      router.replace(`?${newParams.toString()}`, { scroll: false });
    }
  }, [searchParams, isLogin]);

  const handlePayment = async (planType) => {
    if (!isLogin) {
      // Store intention before redirecting
      sessionStorage.setItem("pendingCheckoutPlan", planType);
      if (planType === "custom") {
        sessionStorage.setItem("pendingCheckoutMonths", customMonths);
      }

      toast("Please create an account or login to continue.", { icon: "🔒" });
      router.push(`/auth/login?plan=${planType}&months=${customMonths}`);
      return;
    }

    try {
      setLoadingPlanId(planType);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          planType: planType,
          customMonths: planType === "custom" ? customMonths : undefined,
        }),
      });
      const data = await res.json();

      if (data.success) {
        if (data.url) {
          window.location.href = data.url;
        } else {
          toast.success("Plan activated!");
          router.push("/auth/payment/success?session_id=free_trial");
        }
      } else {
        toast.error(data.message || "Payment initiation failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoadingPlanId(null);
    }
  };

  const calculateCustomPrice = () => {
    if (customMonths <= 1) return 0;
    return (customMonths - 1) * 20;
  };

  const pricingPlans = [
    {
      name: "Monthly Plan",
      id: "monthly",
      period: "/month",
      icon: <Calendar className="h-6 w-6" />,
      description: hasUsedTrial ? "Standard Monthly Plan" : "First Month Free Trial",
      badge: hasUsedTrial ? "Standard" : "1 Month Free Trial",
      price: hasUsedTrial ? "$20" : "$0",
      originalPrice: "$20",
      savings: hasUsedTrial ? "" : "100% OFF 1st Mo",
      features: [
        hasUsedTrial ? "Full Platform Access" : "First Month Free",
        "Then $20/month",
        "Cancel anytime",
        "Full Platform Access",
        "Unlimited courses",
        "Priority support",
        "Live classes",
        "Mobile app access",
      ],
      cta: hasUsedTrial ? "Subscribe Monthly" : "Start Free Trial",
      popular: false,
      color: "border-[#feb500]",
      billingCycle: "monthly",
      disabled: false // User can still subscribe
    },
    {
      name: "Yearly Plan",
      id: "yearly",
      period: "/year",
      icon: <Clock className="h-6 w-6" />,
      description: hasUsedTrial ? "12 Months Access" : "Pay for 11 Months, Get 12",
      badge: hasUsedTrial ? "Standard" : "Best Value",
      price: hasUsedTrial ? "$240" : "$220",
      originalPrice: "$240",
      savings: hasUsedTrial ? "" : "Save $20",
      features: [
        "12 Months Access",
        hasUsedTrial ? "Full Price" : "Pay for only 11 months",
        "One-time payment",
        "Full Platform Access",
        "Unlimited courses",
        "Priority support",
        "Live classes",
        "Mobile app access",
      ],
      cta: "Subscribe Yearly",
      popular: true,
      color: "border-emerald-500",
      billingCycle: "annual",
    },
    {
      name: "Custom Plan",
      id: "custom",
      period: "total",
      icon: <Zap className="h-6 w-6" />,
      description: "Choose your own duration",
      badge: "Flexible",
      price: hasUsedTrial ? `$${customMonths * 20}` : `$${calculateCustomPrice()}`,
      originalPrice: "",
      savings: hasUsedTrial ? "" : "1 Month Free",
      features: [
        `Access for ${customMonths} months`,
        hasUsedTrial ? "Full Price" : "First Month Free (included)",
        "One-time payment",
        "Full Platform Access",
        "Unlimited courses",
        "Priority support",
        "Live classes",
        "Mobile app access",
      ],
      cta: "Get Custom Plan",
      popular: false,
      color: "border-blue-500",
      billingCycle: "custom",
    },
  ];

  return (
    <div>
      <section className="py-20 bg-gradient-to-b from-white to-emerald-50 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Simple, <span className="text-emerald-600">Flexible</span> Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the billing cycle that works best for you. All features
              included in every plan.
            </p>

            {isLogin && isPlanActive && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-10 bg-white border-2 border-emerald-500/30 rounded-3xl p-6 md:p-8 max-w-3xl mx-auto shadow-2xl shadow-emerald-100/50 relative overflow-hidden text-left"
              >
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-50 rounded-full blur-2xl opacity-60" />
                <div className="relative flex flex-col sm:flex-row items-center gap-6">
                  <div className="flex-shrink-0 bg-emerald-100 p-4 rounded-2xl">
                    <CheckCircle className="h-8 w-8 text-emerald-600" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 rounded-full text-[13px] font-black font-normal bg-emerald-600 text-white">
                        Active Subscription
                      </span>
                      <h3 className="text-2xl font-bold text-gray-900 capitalize">
                        {activeSubscription.planType} Plan
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                      Your premium access is active and will remain valid until{" "}
                      <span className="font-bold text-gray-900 underline decoration-emerald-300 decoration-2 underline-offset-4">
                        {new Date(activeSubscription.expiresAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </p>
                  </div>
                  <div className="hidden md:block h-12 w-[1px] bg-gray-100 mx-2" />
                  <div className="flex-shrink-0 text-center sm:text-right">
                    <p className="text-xs font-bold text-emerald-700 uppercase tracking-tighter mb-1">Status</p>
                    <p className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                      Fully Protected
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative bg-white rounded-2xl p-8 border-2 ${plan.color} ${plan.popular
                  ? "shadow-2xl transform -translate-y-2"
                  : "shadow-lg"
                  }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div
                      className={`bg-gradient-to-r text-white px-4 py-1 rounded-full text-sm font-semibold ${plan.billingCycle === "annual"
                        ? "from-emerald-500 to-green-600"
                        : plan.billingCycle === "monthly"
                          ? "from-yellow-400 to-amber-500"
                          : "from-blue-500 to-cyan-500"
                        }`}
                    >
                      {plan.badge}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-center mb-4">
                  <div
                    className={`p-3 rounded-full ${plan.billingCycle === "annual"
                      ? "bg-emerald-100"
                      : plan.billingCycle === "custom"
                        ? "bg-blue-100"
                        : "bg-yellow-100"
                      }`}
                  >
                    <div
                      className={
                        plan.billingCycle === "annual"
                          ? "text-emerald-600"
                          : plan.billingCycle === "custom"
                            ? "text-blue-600"
                            : "text-yellow-600"
                      }
                    >
                      {plan.icon}
                    </div>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                  {plan.name}
                </h3>
                <p className="text-gray-600 mb-4 text-center">
                  {plan.description}
                </p>

                {/* Custom Input */}
                {plan.billingCycle === "custom" && (
                  <div className="mb-4 flex flex-col items-center">
                    <label className="text-sm font-medium text-gray-700 mb-1">Enter Months</label>
                    <input
                      type="number"
                      min="1"
                      value={customMonths}
                      onChange={(e) => setCustomMonths(parseInt(e.target.value) || 1)}
                      className="w-24 text-center border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
                    />
                  </div>
                )}

                {/* Price Display */}
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-5xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>

                  {plan.originalPrice && plan.originalPrice !== plan.price && (
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-sm text-gray-400 line-through">
                        {plan.originalPrice}
                      </span>
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                        {plan.savings}
                      </span>
                    </div>
                  )}

                  <div className="mt-3 h-5">
                    {/* Spacer */}
                  </div>
                </div>

                <button
                  onClick={() => handlePayment(plan.id)}
                  disabled={!!loadingPlanId}
                  className={`w-full py-3 rounded-xl font-semibold mb-8 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 ${plan.popular
                    ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:shadow-lg hover:scale-[1.02]"
                    : plan.billingCycle === "custom"
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:scale-[1.02]"
                      : "bg-gradient-to-r from-yellow-400 to-amber-500 text-white hover:shadow-lg hover:scale-[1.02]"
                    } ${loadingPlanId ? "cursor-not-allowed" : ""}`}
                >
                  {loadingPlanId === plan.id ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    isPlanActive ? "Extend Subscription" : plan.cta
                  )}
                </button>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Verified Features:
                  </h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle
                          className={`h-5 w-5 flex-shrink-0 mt-0.5 mr-3 ${plan.billingCycle === "annual"
                            ? "text-emerald-500"
                            : plan.billingCycle === "custom"
                              ? "text-blue-500"
                              : "text-gray-400"
                            }`}
                        />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Additional Info */}
                {plan.billingCycle === "annual" && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <p className="text-sm text-emerald-600 font-medium text-center">
                      🎉 Save $20 compared to monthly billing
                    </p>
                  </div>
                )}

                {plan.billingCycle === "monthly" && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <p className="text-sm text-amber-600 font-medium text-center">
                      Increase Plnn Update for 1 month
                    </p>
                  </div>
                )}

                {plan.billingCycle === "custom" && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <p className="text-sm text-blue-600 font-medium text-center">
                      🔥 Best for flexible needs
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div >
  );
};

const PricingPlans = () => {
  return (
    <React.Suspense
      fallback={
        <div className="py-20 bg-gradient-to-b from-white to-emerald-50 min-h-[80vh] flex flex-col items-center justify-center px-4">
          <div className="max-w-7xl mx-auto text-center">
            <div className="mb-12 flex justify-center">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-emerald-100 rounded-full"></div>
                <div className="absolute top-0 left-0 w-20 h-20 border-4 border-emerald-600 rounded-full border-t-transparent animate-spin"></div>
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Simple, <span className="text-emerald-600">Flexible</span> Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-pulse">
              Choosing the billing cycle that works best for you...
            </p>
          </div>
        </div>
      }
    >
      <PricingPlansContent />
    </React.Suspense>
  );
};

export default PricingPlans; 
