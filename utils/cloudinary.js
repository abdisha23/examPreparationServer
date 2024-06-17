const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.SECRET_KEY,
});

const cloudinaryUploadFile = async (fileToUpload) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(fileToUpload, {
      resource_type: 'raw', // Set resource_type to 'raw' for non-image files like PDFs
      use_filename: true, // Use the original filename for Cloudinary's public_id
      unique_filename: false, // Do not append a unique identifier to the filename
      folder: 'eXamPrep_files', // Optional: Specify a folder in Cloudinary to organize uploads
      access_mode: 'public' // Ensure the uploaded file is publicly accessible
    }, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve({
          url: result.url,
          public_id: result.public_id,
          contentType: result.resource_type,
          filename: result.original_filename
        });
      }
    });
  });
};

module.exports = { cloudinaryUploadFile };
