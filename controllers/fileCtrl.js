const AsyncHandler = require('express-async-handler');
const CourseMaterial = require('../models/fileModel.js');
const Course = require('../models/courseModel.js');
const upload = require('../utils/multerConfig.js');
const fs = require('fs');
const {cloudinaryUploadFile} = require("../utils/cloudinary");


const createCourseMaterial = AsyncHandler(async (req, res) => {
  const { courseId } = req.params;
  try {
    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404).json('No course found with id!');
    }
    const existingMaterial = await CourseMaterial.findOne({ course: courseId });
    if (existingMaterial) {
      return res.status(400).json('Course material already exists!');
    }
    upload.single('file')(req, res, async (err) => {
      if (err) {
        console.error('Multer error:', err);
        return res.status(400).json({ message: err.message });
      }

      const { title, description } = req.body;
      
      const newFile = {};

      if (title) {
        newFile.title = title;
      }
      if (description) {
        newFile.description = description;
      }
       
        if (req.file) {
          const uploadedFile = await cloudinary.cloudinaryUploadFile(file.path);
          fs.unlinkSync(file.path);
          newFile.file = {
            url: uploadedFile.secure_.url,
            public_id: uploadedFile.public_id,
            contentType: 'application/pdf',
            contentType: file.mimetype,
            filename: file.originalname
          };
        }
        

      res.status(201).json(createdCourseMaterial);
    });
  } catch (error) {
    console.error('Error creating file:', error);
    res.status(500).json({ message: 'Failed to create course material' });
  }
});

const deleteCourseMaterial = async (req, res) => {
  const courseId  = req.params.courseId;
  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json('No course found with id!');
    }

    const courseMaterial = await CourseMaterial.findOne({course : courseId});
    if (!courseMaterial) {
      return res.status(404).json('No material found with id!');
    }

    // Delete the course material from the database
    await CourseMaterial.deleteOne({course: courseId});

    res.status(200).json('Course material deleted successfully');
  } catch (error) {
    console.error('Error deleting course material:', error);
    res.status(500).json({ message: 'Failed to delete course material' });
  }
};

const uploadFile = async (req, res) => {
  const { courseId } = req.params;
  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json('No course found with id!');
    }

    // Check if there's already a CourseMaterial document for this courseId
    let existingMaterial = await CourseMaterial.findOne({ course: courseId });

    // Handle file upload using Multer middleware
    upload.single('file')(req, res, async (err) => {
      try {
        if (err) {
          console.log('Multer error:', err);
          throw new Error(err.message);
        }

        const { title, description } = req.body;
        const newFile = {};

        if (title) {
          newFile.title = title;
        }

        if (description) {
          newFile.description = description;
        }

        if (req.file) {
          const file = req.file;

          const uploadedFile = await cloudinaryUploadFile(file.path);
          fs.unlinkSync(file.path);

          newFile.file = {
            url: uploadedFile.url,
            public_id: uploadedFile.public_id,
            contentType: 'application/pdf', // Assuming it's always PDF based on your code
            filename: file.originalname
          };
        }

        // If existingMaterial is found, update it; otherwise, create a new CourseMaterial
        if (existingMaterial) {
          existingMaterial.files.push(newFile);
          await existingMaterial.save();
        } else {
          // Create a new CourseMaterial document
          const newFiles = [newFile]; // Using an array to match how files are stored

          await CourseMaterial.create({
            course: courseId,
            files: newFiles
          });
        }

        res.status(201).json(newFile);
      } catch (error) {
        console.log('Error handling file upload:', error);
        res.status(500).json({ message: 'Failed to process file upload' });
      }
    });
  } catch (error) {
    console.error('Error finding course:', error);
    res.status(500).json({ message: 'Failed to find course' });
  }
};


const getallFiles = AsyncHandler(async (req, res) => {
  const courseId = req.params.courseId;
  try {
    const course = Course.findById(courseId);
    if(!course){
      res.status(404).json('No course found with id!');
    }
    const courseMaterial = await CourseMaterial.findOne({course: courseId});
    if(!courseMaterial){
      res.status(404).json('No material found for this course!');
    }
    const files = courseMaterial.files;
    res.status(200).json(files);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Failed to load files!' });
  }
});
const getFileById = AsyncHandler(async (req, res) => {
    const {fileId, courseId} = req.params;
  try {
    const course = Course.findById(courseId);
    if(!course){
      res.status(404).json('No course found with id!');
    }
    const courseMaterial = await CourseMaterial.findOne({course: courseId});
    if(!courseMaterial){
        return res.status(404).json({ error: 'No material found for this course!' });
    }
    const file = courseMaterial.files.find((file) => file._id.toString() === fileId);
    if(!file){
      return res.status(404).json({ error: 'Course not found with this id!' });
  }
    res.status(200).json(file);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Failed to load the file!' });
  }
});
const updateFile = async (req, res) => {
  const { fileId, courseId } = req.params;
  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json('No course found with id!');
    }

    const courseMaterial = await CourseMaterial.findOne({ course: courseId });
    if (!courseMaterial) {
      return res.status(400).json('No material found with this course!');
    }

    const existingFileIndex = courseMaterial.files.findIndex(f => f._id.toString() === fileId);
    if (existingFileIndex === -1) {
      return res.status(404).json({ error: 'File not found with this id!' });
    }

    upload.single('file')(req, res, async (err) => {
      if (err) {
        console.error('Multer error:', err);
        return res.status(400).json({ message: err.message });
      }

      const { title, description } = req.body;
      const file = req.file;

      const fileToUpdate = courseMaterial.files[existingFileIndex];
      

      if (file) {
        const uploadedFile = await cloudinary.uploader.upload(file.path);
        fs.unlinkSync(file.path);

        // await cloudinary.uploader.destroy(fileToUpdate.file.public_id);
        fileToUpdate.file.url = uploadedFile.secure_url;
        fileToUpdate.file.public_id = uploadedFile.public_id;
        fileToUpdate.file.contentType = file.mimetype;
        fileToUpdate.file.filename = file.originalname;
      }

      if (title) {
        fileToUpdate.title = title;
      }
      console.log(fileToUpdate);
      if (description) {
        fileToUpdate.description = description;
      }

      await courseMaterial.save();

      res.status(200).json(courseMaterial.files[existingFileIndex]);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update the file!' });
  }
};

const deleteFile = async (req, res) => {
  const { fileId, courseId } = req.params;
  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json('No course found with id!');
    }

    const courseMaterial = await CourseMaterial.findOne({ course: courseId });
    if (!courseMaterial) {
      return res.status(400).json('No material found with this course!');
    }

    const fileIndex = courseMaterial.files.findIndex(f => f._id.toString() === fileId);
    if (fileIndex === -1) {
      return res.status(404).json({ error: 'File not found with this id!' });
    }

    const fileToDelete = courseMaterial.files[fileIndex];

    // Delete the file from Cloudinary
    await cloudinary.uploader.destroy(fileToDelete.file.public_id);

    // Remove the file from the files array
    courseMaterial.files.splice(fileIndex, 1);

    await courseMaterial.save();

    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete the file!' });
  }
};
module.exports = { 
  createCourseMaterial,
  deleteCourseMaterial,
  uploadFile,
  getallFiles,
  getFileById,
  updateFile,
  deleteFile,
};
