const express = require("express");
const {
  superAdminLogin,
  superAdminLogout,
  superAdminAutoLogin,
} = require("./superAdminAuth.controller");

const { superAdmin } = require("./superAdminAuth.middleware");

const router = express.Router();

router.post("/login", superAdminLogin);
router.post("/logout", superAdminLogout);
router.get("/me", superAdmin, superAdminAutoLogin);

// Company Management Routes
const {
  getAllCompanies,
  getCompanyDetails,
  toggleCompanyAccess
} = require("./superAdminCompany.controller");

router.get("/companies", superAdmin, getAllCompanies);
router.get("/companies/:companyId", superAdmin, getCompanyDetails);
router.patch("/companies/:companyId/access", superAdmin, toggleCompanyAccess);

module.exports = router;

