const AsyncHandler = require('express-async-handler');
const Course = require('../models/courseModel.js');


const createCourse = AsyncHandler(async (req, res) => {
  const title = req.body;
  try {
    const course = await Course.create(title);
    res.status(201).json(course);

      }catch(err){
        
            return res.status(500).json({'Failed to create course!': err});
        
      }
    }
);
const getallCourses = AsyncHandler(async (req, res) => {
  try {
    const courses = await Course.find();

    res.status(200).json(courses);

      }catch(err){
        
            return res.status(500).json({'Failed to load courses!': err});
        
      }
    }
);
const getCourse = AsyncHandler(async (req, res) => {
  const courseId = req.params.courseId;
  try {
    const course = await Course.findById(courseId);
    if(!course){
      return res.status(404).json('No course found with this id!');
    }
    res.status(200).json(course);

      }catch(err){
        
            return res.status(500).json({'Failed to load the course!': err});
        
      }
    }
);
const deleteCourse = AsyncHandler(async (req, res) => {
    const courseId = req.params.courseId;
  try {
    const deletedCourse = await Course.findByIdAndDelete(courseId);
    if(!deletedCourse){
      return res.status(404).json('No course found with this id!');
    }
    res.status(200).json(deletedCourse);

      }catch(err){
        
            return res.status(500).json({'Failed to delete course!': err});
        
      }
    }
);

module.exports = {
  createCourse,
  getallCourses,
  getCourse,
  deleteCourse
}
      