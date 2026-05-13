const Stripe = require("stripe");
const stripe = process.env.STRIPE_SECRET_KEY ? Stripe(process.env.STRIPE_SECRET_KEY) : null;

if (!stripe) {
    console.warn("⚠️ STRIPE_SECRET_KEY is missing from .env. Payment features will not work.");
}
const Company = require("../companyAuth/Company");
const { decrypt } = require("../../utils/encryption");
const nodemailer = require("nodemailer");

const MONTHLY_PRICE = 2000; // in cents ($20)

// Helper to calculate cost
const calculateCost = (planType, durationMonths = 1) => {
    // Logic: 1 month free. 
    // Monthly (1 month): $0 first month? User said "1 month ke 20$ hen. and first one month free he".
    // Does this mean they pay $0 now? Or pay $20 and get 2 months?
    // "1 month ke 20$ hen. and first one month free he . yani user jo bi plan se chose kre calculations same hi ho."
    // "ager use ne iyear plan chose kya to ose 11 months ke charges lge ge and 1 month free"
    // So:
    // Monthly: Charge $0? Or Charge for next month? 
    // Usually "1st month free" means a subscription with a trial period.
    // Yearly: Charge for 11 months ($220). Duration: 12 months.
    // Custom N months: Charge for N-1 months. Duration: N months.

    let priceInCents = 0;

    if (planType === "monthly") {
        // Stripe Trial logic handles "free" period.
        // If we use Subscription, we can set trial_period_days = 30.
        priceInCents = MONTHLY_PRICE;
    } else if (planType === "yearly") {
        // 11 months cost, 12 months access.
        // One-time payment or subscription? User said "2nd plan yealy bnao".
        // Simplest: One-time payment for 1 year access.
        priceInCents = MONTHLY_PRICE * 11;
    } else if (planType === "custom") {
        if (durationMonths <= 1) return 0; // Should handle differently if just 1 month
        priceInCents = MONTHLY_PRICE * (durationMonths - 1);
    }

    return priceInCents;
};

const createCheckoutSession = async (req, res) => {
    console.log("req rec")
    try {
        const { planType, customMonths } = req.body;
        const company = req.company;

        if (!company) return res.status(401).json({ success: false, message: "Unauthorized" });

        // Base URL for success/cancel
        const SUCCESS_URL = `${process.env.CLIENT_URL}/auth/payment/success?session_id={CHECKOUT_SESSION_ID}`;
        const CANCEL_URL = `${process.env.CLIENT_URL}/auth/payment`;

        let sessionConfig = {
            payment_method_types: ["card"],
            mode: "payment", // Default to one-time for Yearly/Custom
            success_url: SUCCESS_URL,
            cancel_url: CANCEL_URL,
            customer_email: company.account.email,
            metadata: {
                companyId: company._id.toString(),
                planType,
                customMonths: customMonths || 1
            },
            line_items: []
        };

        if (planType === "monthly" || (planType === "custom" && parseInt(customMonths) === 1)) {
            // Logic for Monthly OR Custom 1 Month: Subscription with 30 days trial
            // "1st plan 0$ show krwao... user can take only 1monh plan"

            // Attempting to create a product/price on the fly or just assume $20.
            // Stripe Checkout for subscription needs a Price ID.
            // Workaround: Create a Price each time or define a constant one if we had it.
            // I will create a Price for "Monthly Plan" now.

            // Ensure product exists
            // Optimization: In a real app we'd store the priceId.
            const price = await stripe.prices.create({
                unit_amount: MONTHLY_PRICE,
                currency: "usd",
                recurring: { interval: "month" },
                product_data: { name: "Empowerings LMS - Monthly Plan" },
            });

            sessionConfig.mode = "subscription";
            sessionConfig.line_items = [{ price: price.id, quantity: 1 }];

            // Check if user has already used the trial or completed a payment
            if (!company.subscription?.hasUsedTrial && !company.subscription?.paymentCompleted) {
                sessionConfig.subscription_data = {
                    trial_period_days: 30
                };
            }

        } else {
            // Yearly or Custom - One time payment
            let amount = 0;
            let name = "";

            if (planType === "yearly") {
                if (company.subscription?.hasUsedTrial) {
                    amount = MONTHLY_PRICE * 12; // Full price
                    name = "Empowerings LMS - Yearly Plan";
                } else {
                    amount = MONTHLY_PRICE * 11; // 1 Month Free
                    name = "Empowerings LMS - Yearly Plan (1 Month Free)";
                }
            } else { // Custom > 1 month
                const months = parseInt(customMonths) || 1;

                if (company.subscription?.hasUsedTrial) {
                    amount = MONTHLY_PRICE * months; // Full price
                    name = `Empowerings LMS - ${months} Months Plan`;
                } else {
                    amount = MONTHLY_PRICE * (months - 1); // 1 Month Free
                    name = `Empowerings LMS - ${months} Months Plan (1 Month Free)`;
                }
            }

            // If amount is 0 (e.g. 1 month custom), create Setup Session? 
            // Or just redirect to success? 
            // User flow requires Payment Page. 
            // If 1 month custom is selected -> Price is 0. Stripe Checkout supports free? No, usually Setup mode.
            // Let's enforce minimum $20 (2 months) for Custom One-Time or fall back to Monthly Subscription if 1 month.

            sessionConfig.line_items = [{
                price_data: {
                    currency: "usd",
                    product_data: { name },
                    unit_amount: amount,
                },
                quantity: 1,
            }];
        }

        const session = await stripe.checkout.sessions.create(sessionConfig);

        res.status(200).json({ success: true, url: session.url });

    } catch (error) {
        console.error("Stripe Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const handlePaymentSuccess = async (req, res) => {
    console.log("Payment Success Handler Triggered");
    try {
        const { session_id } = req.body;
        if (!session_id) return res.status(400).json({ success: false, message: "Session ID required" });

        const session = await stripe.checkout.sessions.retrieve(session_id);

        const { companyId, planType, customMonths } = session.metadata;

        const company = await Company.findById(companyId);
        if (!company) return res.status(404).json({ success: false, message: "Company not found" });

        // Prevent duplicate updates
        if (company.subscription.paymentCompleted && company.subscription.stripeSessionId === session_id) {
            return res.status(200).json({ success: true, message: "Already processed" });
        }

        // Calculate expiry
        let startDate = new Date();
        let expiresAt = new Date();

        // Check for existing active subscription to extend
        if (company.subscription?.paymentCompleted && new Date(company.subscription.expiresAt) > new Date()) {
            startDate = new Date(company.subscription.startDate); // Keep original start date
            expiresAt = new Date(company.subscription.expiresAt); // Start from existing expiry
        }

        // Add duration logic
        // Monthly: 1 Month
        // Yearly: 12 Months
        // Custom: N Months

        let durationMonths = 1;

        if (planType === "monthly") {
            durationMonths = 1;
        } else if (planType === "yearly") {
            durationMonths = 12;
        } else if (planType === "custom") {
            durationMonths = parseInt(customMonths) || 1;
        }

        expiresAt.setMonth(expiresAt.getMonth() + durationMonths);

        company.subscription = {
            status: "active",
            planType, // Update to latest plan type (e.g. they might switch to Yearly)
            planDurationMonths: durationMonths, // Records the duration of the *latest* purchase. 
            // Note: Total duration isn't stored explicitly, but implied by startDate/expiresAt difference.
            startDate,
            expiresAt,
            stripeCustomerId: session.customer,
            stripeSubscriptionId: session.subscription,
            stripeSessionId: session_id,
            paymentCompleted: true,
            hasUsedTrial: true
        };

        // Ensure account is verified if they paid? 
        // Usually payment means they are somewhat verified, but let's stick to email verification for that.
        // However, user said "onboardingCompleted" removed. 

        await company.save();

        // Send Subscription Confirmation Email
        try {
            const sendSubscriptionEmail = require("./sendSubscriptionEmail");
            const adminUrl = process.env.ADMIN_PANEL_URL || "http://localhost:5173"; // Fallback to local

            // Decrypt password
            const decryptedPassword = decrypt(company.account.password);

            console.log("company : ", company)

            await sendSubscriptionEmail(
                company.account.email,
                company.account.name,
                {
                    planType,
                    duration: durationMonths,
                    expiryDate: expiresAt
                },
                adminUrl,
                decryptedPassword // Pass decrypted password
            );
        } catch (emailErr) {
            console.error("Subscription email failed", emailErr);
        }

        res.status(200).json({ success: true, data: company });

    } catch (error) {
        console.error("Success Handler Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { createCheckoutSession, handlePaymentSuccess };
