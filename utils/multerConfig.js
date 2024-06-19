const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads'); // Specify the directory where the files will be uploaded
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext); // Generate a unique filename with original extension
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // Set a reasonable file size limit (e.g., 50MB)
  },
  fileFilter: function (req, file, cb) {
    const allowedMimes = ['application/pdf', 'video/mp4', 'video/mpeg', 'video/quicktime']; // Add more video mimetypes as needed

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true); // Accept PDF and video files
    } else {
      cb(new Error('Only PDF and video files are allowed'));
    }
  }
});

module.exports = upload;
