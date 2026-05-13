const express = require("express");
const router = express.Router();
const { getDashboardStats } = require("../controllers/dashboard.controller");

const { company } = require("../modules/companyAuth/companyAuth.middleware");

router.get("/stats", company, getDashboardStats);

module.exports = router;
