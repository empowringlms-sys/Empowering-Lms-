const multer = require('multer');

const createFileUpload = () => {
  const storage = multer.memoryStorage();
  
  return multer({
    storage: storage,
    limits: {
      fileSize: 100 * 1024 * 1024, // 100MB
      files: 10 // Max 10 files for multiple upload
    },
    fileFilter: (req, file, cb) => {
      // Accept all file types
      cb(null, true);
    }
  });
};

module.exports = createFileUpload;