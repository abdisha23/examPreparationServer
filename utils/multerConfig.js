const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../uploads'); // Specify the directory where the files will be uploaded
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.originalname + '-' + uniqueSuffix); // Generate a unique filename
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: Infinity // Set the fileSize limit to Infinity for unlimited file size
  }
});

module.exports = upload;