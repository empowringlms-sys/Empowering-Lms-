const Company = require("../companyAuth/Company");
const { Course } = require("../courses/course.model");
const Student = require("../userAuth/Learner");
// const Payment = require("../payment/payment.model"); // Payment model not yet implemented

// Get all companies with stats
const getAllCompanies = async (req, res) => {
    try {
        const companies = await Company.find({})
            .select("-account.password -account.otp")
            .sort({ createdAt: -1 });

        // Aggregate stats for each company
        // Note: optimization possible with $lookup, but iterating for simplicity or small scale first
        const companiesWithStats = await Promise.all(
            companies.map(async (company) => {
                const courseCount = await Course.countDocuments({ company: company._id });
                const learnerCount = await Student.countDocuments({ companyId: company._id });

                return {
                    ...company.toObject(),
                    stats: {
                        courses: courseCount,
                        learners: learnerCount,
                    }
                };
            })
        );

        res.status(200).json({
            success: true,
            data: companiesWithStats,
        });
    } catch (error) {
        console.error("Get all companies error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch companies",
            error: error.message,
        });
    }
};

// Get single company details
const getCompanyDetails = async (req, res) => {
    try {
        const { companyId } = req.params;
        const company = await Company.findById(companyId).select("-account.password -account.otp");

        if (!company) {
            return res.status(404).json({ success: false, message: "Company not found" });
        }

        // Fetch related data
        const courses = await Course.find({ company: companyId }).select("courseName isVisible createdAt");
        const learners = await Student.find({ companyId: companyId }).select("name email createdAt");
        // const payments = await Payment.find({ 'metadata.companyId': companyId }).sort({ createdAt: -1 }); 
        // Payment schema/query needs verification, assuming metadata linkage or email linkage

        const stats = {
            courseCount: courses.length,
            learnerCount: learners.length,
        };

        res.status(200).json({
            success: true,
            data: {
                company,
                stats,
                recentCourses: courses.slice(0, 5),
                recentLearners: learners.slice(0, 5),
                // payments
            },
        });
    } catch (error) {
        console.error("Get company details error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch company details",
            error: error.message,
        });
    }
};

// Toggle Manual Access
const toggleCompanyAccess = async (req, res) => {
    try {
        const { companyId } = req.params;
        const company = await Company.findById(companyId);

        if (!company) {
            return res.status(404).json({ success: false, message: "Company not found" });
        }

        // Initialize if undefined (schema default handles new docs, but old docs might be empty)
        if (company.profile.manualAccessStatus === undefined) {
            company.profile.manualAccessStatus = true;
        }

        // Toggle
        company.profile.manualAccessStatus = !company.profile.manualAccessStatus;
        await company.save();

        res.status(200).json({
            success: true,
            message: `Company access is now ${company.profile.manualAccessStatus ? "GRANTED" : "REVOKED"}`,
            data: {
                manualAccessStatus: company.profile.manualAccessStatus
            }
        });

    } catch (error) {
        console.error("Toggle access error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to toggle access",
            error: error.message,
        });
    }
};

module.exports = {
    getAllCompanies,
    getCompanyDetails,
    toggleCompanyAccess
};
