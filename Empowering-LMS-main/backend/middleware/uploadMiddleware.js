const multer = require("multer");

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Determine upload path - for now using /tmp or similar if needed, 
        // but typically with Cloudinary we might use memoryStorage or temporary disk storage.
        // Using /tmp for serverless compat or local temp. 
        // Since this is a standard node app, let's use system temp or just root temp.
        const os = require('os');
        cb(null, os.tmpdir());
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + "-" + file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB Limit
});

module.exports = upload;
