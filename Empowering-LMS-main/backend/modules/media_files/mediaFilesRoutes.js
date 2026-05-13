const express = require("express");
const router = express.Router();
const createFileUpload = require("./fileUpload");
const {
  uploadFile,
  uploadMultipleFiles,
  getAllFiles,
  getFileById,
  deleteFile,
  getFileStats,
  editFileName,
} = require("./mediaFilesController");

// Create upload middleware instance
// Create upload middleware instance
const upload = createFileUpload();
const { company, attachCompany } = require("../companyAuth/companyAuth.middleware");
const { admin } = require("../adminAuth/adminAuth.middleware");
const { superAdmin } = require("../superAdminAuth/superAdminAuth.middleware");

// Combined Auth Middleware
const allowAuth = async (req, res, next) => {
  const portal = req.headers['x-portal'];

  // 1. If Explicitly Super Admin Portal
  if (portal === 'super-admin' && req.cookies?.super_admin_token) {
    return superAdmin(req, res, next);
  }

  // 2. If Explicitly Company Portal (Cookie or Header)
  if (portal === 'company') {
    if (req.cookies?.admin_token) return admin(req, res, next);
    if (req.headers?.authorization) {
      await attachCompany(req, res, async () => {
        return company(req, res, next);
      });
      return;
    }
  }

  // 3. Fallback (Legacy/No Header) - Strict Order
  // If no header, we prioritize Super Admin if the token exists, BUT
  // ideally frontends should now send the header.
  if (req.cookies?.super_admin_token) {
    return superAdmin(req, res, next);
  }

  if (req.cookies?.admin_token) {
    return admin(req, res, next);
  }

  if (req.headers?.authorization) {
    await attachCompany(req, res, async () => {
      return company(req, res, next);
    });
    return;
  }

  return res.status(401).json({ message: "Authentication required" });
};

// Apply combined middleware to all routes
router.use(allowAuth);

// Upload single file
router.post("/upload", upload.single("file"), uploadFile);

// Upload multiple files
router.post("/upload-multiple", upload.array("files"), uploadMultipleFiles);

// Get all files with filtering and pagination
router.get("/", getAllFiles);

// Get file statistics
router.get("/stats", getFileStats);

// Get single file
router.get("/:id", getFileById);

// Delete file
router.delete("/:id", deleteFile);

// Edit file name
router.patch("/:id/name", editFileName);

// Module info endpoint
router.get("/info", (req, res) => {
  res.json({
    module: "Digital Files",
    version: "1.0.0",
    description: "File management module for LMS",
    endpoints: {
      upload: "POST /upload",
      uploadMultiple: "POST /upload-multiple",
      getAll: "GET /",
      getOne: "GET /:id",
      delete: "DELETE /:id",
      stats: "GET /stats",
    },
    features: [
      "File upload to Cloudinary",
      "Support for images, videos, documents, audio, archives",
      "Multiple file upload",
      "Pagination and filtering",
      "File type categorization",
      "Statistics",
    ],
  });
});

module.exports = router;
