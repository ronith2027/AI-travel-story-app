const multer = require("multer");
const path = require("path");

// Storage configuration
const storage = multer.diskStorage({
    destination: function(req, file, cd) {
        cd(null, "./uploads"); // Destination folder for uploading files
    },
    filename: function(req, file, cd) {
        cd(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
});

// File filter to accept only images
const fileFilter = (req, file, cd) => {
    if (file.mimetype.startsWith("image/")) {
        cd(null, true);
    } else {
        cd(new Error("Only images are allowed"), false);
    }
};

// Initialize multer instance
const upload = multer({ storage, fileFilter });

module.exports = upload;
