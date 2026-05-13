const Company = require("../companyAuth/Company");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// Helper to sanitize response
const cleanCompanyObject = (company) => {
    if (!company) return null;
    let companyObject = company.toObject();
    if (companyObject.account) {
        delete companyObject.account.password;
        delete companyObject.account.otp;
    }
    return companyObject;
};

// Update Profile
const updateProfile = async (req, res) => {
    try {
        const user = req.user;
        if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });

        const {
            name,
            description,
            industry,
            country,
            contactNo,
            address,

            registrationNo,
            slug // Check for slug update
        } = req.body;

        const company = await Company.findById(user._id || user.id);
        if (!company) return res.status(404).json({ success: false, message: "Company not found" });

        // Logo is now passed as a URL string from the frontend (via Media Picker)
        // If logo is not provided in body, keep existing or default to empty
        let logoUrl = req.body.logo;
        if (logoUrl === undefined) {
            // If completely missing from body, maybe keep existing? 
            // But if user sends empty string, they might mean "remove logo".
            // Let's assume sending nothing means no change for now, unless explicitly empty.
            logoUrl = company.profile?.logo || "";
        }

        // Handle Slug Update (Unique Check)
        if (slug && slug !== company.profile.slug) {
            const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
            if (!slugRegex.test(slug)) {
                return res.status(400).json({ success: false, message: "Invalid slug format. Use lowercase alphanumeric and hyphens." });
            }

            const existingSlug = await Company.findOne({ "profile.slug": slug });
            if (existingSlug) {
                return res.status(409).json({ success: false, message: "Slug already taken." });
            }
            company.profile.slug = slug;
        }

        // Handle Name Update (Unique Check)
        if (name && name !== company.account.name) {
            const existingCompany = await Company.findOne({ "account.name": name });
            if (existingCompany) {
                return res.status(409).json({ success: false, message: "Company name already taken" });
            }
            company.account.name = name;
        }

        // Update Profile Fields
        // Only update fields if they are provided/changed (or if logic above handled it)
        // Important: company.profile might be overwritten if we construct a new object. Use Object.assign or spread carefully.

        company.profile.description = description !== undefined ? description : company.profile.description;
        company.profile.industry = industry !== undefined ? industry : company.profile.industry;
        company.profile.country = country !== undefined ? country : company.profile.country;
        company.profile.contactNo = contactNo !== undefined ? contactNo : company.profile.contactNo;
        company.profile.address = address !== undefined ? address : company.profile.address;
        company.profile.registrationNo = registrationNo !== undefined ? registrationNo : company.profile.registrationNo;
        company.profile.logo = logoUrl;
        // slug is already updated above if validated

        await company.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: cleanCompanyObject(company),
            learnerPanelUrl: process.env.LEARNER_PANEL_URL
        });

    } catch (error) {
        console.error("Update Profile Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Profile
const getProfile = async (req, res) => {
    try {
        const user = req.user;
        const company = await Company.findById(user._id || user.id).select("-account.password -account.otp");
        if (!company) return res.status(404).json({ success: false, message: "Company not found" });

        res.status(200).json({
            success: true,
            data: company,
            learnerPanelUrl: process.env.LEARNER_PANEL_URL
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = { updateProfile, getProfile };
