const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { attachUser } = require("./modules/userAuth/learners.middleware.js");
const cookieParser = require("cookie-parser");
const debugMiddleware = require('./debugMiddleware');
// Import database connection
const connectDB = require("./utils/db");


// Import routes
const mediaFilesRoutes = require("./modules/media_files/mediaFilesRoutes");
const courseRoutes = require("./modules/courses/course.routes");
const adminAuthRoutes = require("./modules/adminAuth/adminAuth.routes");
const superAdminAuthRoutes = require("./modules/superAdminAuth/superAdminAuth.routes");
const userRoutes = require("./modules/userAuth/learners.routes.js");
const paymentRoutes = require("./modules/payment/payment.routes"); // Added payment routes
const companyRoutes = require("./modules/companyAuth/companyAuth.routes.js");
const dashboardRoutes = require("./routes/dashboard.routes");

// ✅ Get allowed origins from environment or use defaults
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [
    "https://admin-empowerings.vercel.app", // Your live frontend
    "https://server-empowerings.vercel.app", // Your backend (for testing)
    "http://localhost:5173", // Local frontend
    "http://localhost:5174", // Alternative local port
    "http://localhost:3000",
  ];

// ✅ Enhanced CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin && process.env.NODE_ENV === "development") {
        return callback(null, true);
      }

      // Check if the origin is in the allowed list
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        return callback(null, origin);
      } else {
        const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
        console.error("CORS Blocked:", { origin, allowedOrigins });
        return callback(new Error(msg), false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "X-Requested-With",
      "x-portal", // Allow custom portal identification header
    ],
    exposedHeaders: ["Set-Cookie"],
  })
);

// Handle preflight requests globally
app.options("*", cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(attachUser);
// app.use(debugMiddleware);
connectDB();

// Use main routes
app.use("/api/admin", adminAuthRoutes);
app.use("/api/super-admin", superAdminAuthRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/media-files", mediaFilesRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/users", userRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/payment", paymentRoutes);
const companyProfileRoutes = require("./modules/companyProfile/companyProfile.routes");
app.use("/api/profile", companyProfileRoutes);
// Add debug endpoints
app.get("/api/debug/cookies", (req, res) => {
  res.json({
    success: true,
    cookies: req.cookies,
    headers: {
      origin: req.headers.origin,
      cookie: req.headers.cookie,
      host: req.headers.host,
    },
    env: process.env.NODE_ENV,
    allowedOrigins,
    timestamp: new Date().toISOString(),
  });
});

app.post("/api/debug/set-cookie", (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("debug_cookie", "test_value_" + Date.now(), {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    maxAge: 3600000,
    path: "/",
  });

  res.json({
    success: true,
    message: "Debug cookie set",
    cookieSettings: {
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
      httpOnly: true,
    },
  });
});

// Welcome api
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the LMS Server of Empowerings",
    description:
      "The Learning Management System (LMS) Server provides a robust platform to manage and streamline all core functionalities of the Empowerings LMS, enabling efficient course delivery, digital resource management, and seamless user engagement.",
    timestamp: new Date().toLocaleString(),
  });
});

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error("Server Error:", err.message);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === "development" && { error: err.stack }),
  });
};

app.use(errorHandler);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 LMS Server Started on : http://localhost:${PORT}`);
  console.log(`👤 Profile Routes registered at /api/profile`);
});
