const MediaFile = require("./MediaFileModel");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to determine file type
const getFileType = (mimeType, extension) => {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";

  // Document types
  const documentExtensions = [
    "pdf",
    "doc",
    "docx",
    "txt",
    "rtf",
    "xls",
    "xlsx",
    "csv",
    "ppt",
    "pptx",
  ];
  if (documentExtensions.includes(extension)) return "document";

  // Archive types
  const archiveExtensions = ["zip", "rar", "7z", "tar", "gz"];
  if (archiveExtensions.includes(extension)) return "archive";

  return "other";
};

// Helper to clean filename
const cleanFileName = (filename) => {
  return filename
    .replace(/\.[^/.]+$/, "") // Remove extension
    .replace(/[^a-zA-Z0-9_-]/g, "_") // Replace special chars with underscore
    .substring(0, 100); // Limit length
};

// Upload single file
const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file provided",
      });
    }

    // Determine ownership
    let companyId = null;
    let isGlobal = false;

    if (req.company) {
      companyId = req.company._id;
    } else if (req.superAdmin) {
      // Super Admin upload
      isGlobal = true;
    } else {
      // Fallback or error
      return res.status(403).json({
        success: false,
        message: "Unauthorized upload access",
      });
    }

    const { originalname, size, mimetype, buffer } = req.file;
    const extension = originalname.split(".").pop().toLowerCase();
    const fileType = getFileType(mimetype, extension);

    // Generate clean filename and public ID
    const cleanName = cleanFileName(originalname);
    const timestamp = Math.floor(Date.now() / 1000); // Use seconds for Cloudinary
    const randomStr = Math.random().toString(36).substring(2, 10);
    const publicId = `lms_files/${cleanName}_${timestamp}_${randomStr}`;

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          public_id: publicId,
          resource_type: "auto",
          folder: "lms_files",
          timestamp: timestamp, // Add timestamp to options
          invalidate: true,
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      streamifier.createReadStream(buffer).pipe(uploadStream);
    });

    // Create file record in database
    const mediaFile = new MediaFile({
      name: originalname,
      size: size,
      src: uploadResult.secure_url,
      type: fileType,
      extension: extension,
      company: companyId,
      isGlobal: isGlobal,
    });

    await mediaFile.save();

    res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      data: {
        _id: mediaFile._id,
        name: mediaFile.name,
        size: mediaFile.size,
        src: mediaFile.src,
        type: mediaFile.type,
        extension: mediaFile.extension,
        createdAt: mediaFile.createdAt,
        isGlobal: mediaFile.isGlobal,
      },
    });
  } catch (error) {
    console.error("Upload error details:", error);

    // Specific error handling for Cloudinary
    if (error.message && error.message.includes("Invalid Signature")) {
      return res.status(400).json({
        success: false,
        message:
          "Cloudinary authentication error. Please check your API credentials.",
      });
    }

    if (error.http_code === 400) {
      return res.status(400).json({
        success: false,
        message: error.message || "Invalid file format",
      });
    }

    res.status(500).json({
      success: false,
      message: "File upload failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Upload multiple files
const uploadMultipleFiles = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files provided",
      });
    }

    // Determine ownership
    let companyId = null;
    let isGlobal = false;

    if (req.company) {
      companyId = req.company._id;
    } else if (req.superAdmin) {
      isGlobal = true;
    } else {
      return res.status(403).json({
        success: false,
        message: "Unauthorized upload access",
      });
    }

    const uploadPromises = req.files.map(async (file) => {
      try {
        const { originalname, size, mimetype, buffer } = file;
        const extension = originalname.split(".").pop().toLowerCase();
        const fileType = getFileType(mimetype, extension);

        // Generate clean filename and public ID
        const cleanName = cleanFileName(originalname);
        const timestamp = Math.floor(Date.now() / 1000);
        const randomStr = Math.random().toString(36).substring(2, 10);
        const publicId = `lms_files/${cleanName}_${timestamp}_${randomStr}`;

        // Upload to Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              public_id: publicId,
              resource_type: "auto",
              folder: "lms_files",
              timestamp: timestamp,
              invalidate: true,
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );

          streamifier.createReadStream(buffer).pipe(uploadStream);
        });

        // Create file record
        const mediaFile = new MediaFile({
          name: originalname,
          size: size,
          src: uploadResult.secure_url,
          type: fileType,
          extension: extension,
          company: companyId,
          isGlobal: isGlobal,
        });

        await mediaFile.save();

        return {
          success: true,
          data: {
            _id: mediaFile._id,
            name: mediaFile.name,
            size: mediaFile.size,
            src: mediaFile.src,
            type: mediaFile.type,
            isGlobal: mediaFile.isGlobal,
          },
        };
      } catch (fileError) {
        console.error(
          `Failed to upload ${file.originalname}:`,
          fileError.message
        );
        return {
          success: false,
          filename: file.originalname,
          error: fileError.message,
        };
      }
    });

    const results = await Promise.all(uploadPromises);

    const successful = results.filter((r) => r.success);
    const failed = results.filter((r) => !r.success);

    res.status(200).json({
      success: true,
      message: `Upload completed. Successful: ${successful.length}, Failed: ${failed.length}`,
      data: {
        successful: successful.map((s) => s.data),
        failed: failed.map((f) => ({ filename: f.filename, error: f.error })),
      },
    });
  } catch (error) {
    console.error("Multiple upload error:", error);
    res.status(500).json({
      success: false,
      message: "Multiple file upload failed",
    });
  }
};

// Get all files
const getAllFiles = async (req, res, next) => {
  try {
    const { type, sort = "desc", page = 1, limit = 20 } = req.query;

    // Build query
    const query = {};

    if (req.company) {
      // Company sees their own files AND global files
      query.$or = [{ company: req.company._id }, { isGlobal: true }];
    } else if (req.superAdmin) {
      // Super Admin sees ONLY global files
      query.isGlobal = true;
    } else {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    if (
      type &&
      ["image", "video", "audio", "document", "archive", "other"].includes(type)
    ) {
      query.type = type;
    }

    // Build sort
    const sortOrder = sort === "asc" ? 1 : -1;
    const sortQuery = { createdAt: sortOrder };

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [files, total] = await Promise.all([
      MediaFile.find(query)
        .sort(sortQuery)
        .skip(skip)
        .limit(parseInt(limit))
        .select("_id name size src type extension createdAt isGlobal"),
      MediaFile.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: {
        files,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error("Get all files error:", error);
    next(error);
  }
};

// Get file by ID
const getFileById = async (req, res, next) => {
  try {
    const file = await MediaFile.findOne({ _id: req.params.id, company: req.company._id });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    res.status(200).json({
      success: true,
      data: file,
    });
  } catch (error) {
    console.error("Get file by ID error:", error);
    next(error);
  }
};

// Delete file
const deleteFile = async (req, res, next) => {
  try {
    // Determine query based on user
    const query = { _id: req.params.id };

    if (req.company) {
      query.company = req.company._id;
      // Company can ONLY delete their own files. Global files (company: null or other) naturally excluded.
    } else if (req.superAdmin) {
      query.isGlobal = true; // Admin can only delete global files (safeguard)
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const file = await MediaFile.findOne(query);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found or access denied",
      });
    }
    // Extract public ID from Cloudinary URL PROPERLY
    let publicId = "";

    // Method 1: Extract from URL
    const urlParts = file.src.split("/");
    // Find the index of 'upload' in the URL path
    const uploadIndex = urlParts.indexOf("upload");
    if (uploadIndex !== -1 && uploadIndex + 1 < urlParts.length) {
      // Get everything after 'upload/' including version and public_id
      const afterUpload = urlParts.slice(uploadIndex + 1).join("/");
      // Remove version prefix (v169...)
      publicId = afterUpload.replace(/^v\d+\//, "");
      // Remove file extension
      publicId = publicId.replace(/\.[^/.]+$/, "");
    }
    if (!publicId) {
      // If extraction fails, use filename from database
      const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
      const cleanName = fileNameWithoutExt.replace(/[^a-zA-Z0-9_-]/g, "_");
      publicId = `lms_files/${cleanName}`;
    }

    // Delete from Cloudinary with response handling

    const cloudinaryResult = await cloudinary.uploader.destroy(publicId, {
      invalidate: true, // Invalidate CDN cache
      resource_type: file.type === "video" ? "video" : "image", // Set resource type
    });


    // Check Cloudinary response
    if (
      cloudinaryResult.result !== "ok" &&
      cloudinaryResult.result !== "not found"
    ) {
      console.warn("Cloudinary deletion may have failed:", cloudinaryResult);
      // Continue with database deletion even if Cloudinary fails
    }

    // Delete from database
    await MediaFile.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "File deleted successfully",
      cloudinaryResult: cloudinaryResult.result,
    });
  } catch (error) {
    console.error("Delete file error:", error);

    // If Cloudinary delete fails, still delete from database
    if (req.params.id) {
      try {
        await MediaFile.findOneAndDelete({ _id: req.params.id, company: req.company._id });
      } catch (dbError) {
        console.error("Database deletion also failed:", dbError);
      }
    }

    res.status(500).json({
      success: false,
      message: "File deletion completed with warnings",
      error: error.message,
      note: "File removed from database, Cloudinary cleanup may be needed",
    });
  }
};

// Get file statistics
const getFileStats = async (req, res, next) => {
  try {
    let matchStage = {};

    if (req.company) {
      matchStage = {
        $or: [
          { company: req.company._id },
          { isGlobal: true }
        ]
      };
    } else if (req.superAdmin) {
      matchStage = { isGlobal: true };
    } else {
      return res.status(403).json({ message: "Unauthorized access for stats" });
    }

    const stats = await MediaFile.aggregate([
      {
        $match: matchStage
      },
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
          totalSize: { $sum: "$size" },
        },
      },
      {
        $project: {
          type: "$_id",
          count: 1,
          totalSize: 1,
          _id: 0,
        },
      },
    ]);

    const totalStats = await MediaFile.aggregate([
      {
        $match: matchStage
      },
      {
        $group: {
          _id: null,
          totalFiles: { $sum: 1 },
          totalSize: { $sum: "$size" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        byType: stats,
        total: totalStats[0] || { totalFiles: 0, totalSize: 0 },
      },
    });
  } catch (error) {
    console.error("Get file stats error:", error);
    next(error);
  }
};

// Edit file name only (updates only the name field in MongoDB)
const editFileName = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // Validate input
    if (!name || typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "New file name is required and cannot be empty",
      });
    }

    // Clean and trim the name
    const cleanedName = name.trim();

    // Validate name length (optional, but good practice)
    if (cleanedName.length > 255) {
      return res.status(400).json({
        success: false,
        message: "File name cannot exceed 255 characters",
      });
    }

    // Check if file exists and get current data
    const existingFile = await MediaFile.findOne({ _id: id, company: req.company._id });

    if (!existingFile) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    // Get current extension
    const currentExtension = existingFile.extension;

    // Create new full filename with same extension
    const newFullName = cleanedName.endsWith(`.${currentExtension}`)
      ? cleanedName // If user already included extension, use as is
      : `${cleanedName}.${currentExtension}`;

    // Check if name actually changed
    if (existingFile.name === newFullName) {
      return res.status(200).json({
        success: true,
        message: "File name unchanged",
        data: {
          id: existingFile._id,
          name: existingFile.name,
          extension: existingFile.extension,
        },
      });
    }

    // Update only the name field
    const updatedFile = await MediaFile.findByIdAndUpdate(
      id,
      {
        name: newFullName,
        // UpdatedAt will be automatically updated by timestamps: true
      },
      {
        new: true, // Return the updated document
        runValidators: true, // Run model validators
      }
    ).select("_id name size src type extension createdAt updatedAt");

    if (!updatedFile) {
      return res.status(404).json({
        success: false,
        message: "File not found after update attempt",
      });
    }

    // Prepare response
    const response = {
      success: true,
      message: "File name updated successfully",
      data: updatedFile,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Edit file name error:", error);

    // Handle specific errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid file ID format",
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A file with this name already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update file name",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
module.exports = {
  uploadFile,
  uploadMultipleFiles,
  getAllFiles,
  getFileById,
  deleteFile,
  getFileStats,
  editFileName,
};



