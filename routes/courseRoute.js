const express = require('express');
const {
    createCourse, 
    getallCourses,
    getCourse,
    deleteCourse,
    } = require('../controllers/courseCtrl');
const {authMiddleware, isAdmin} = require('../middlewares/authMiddleware');
const router = express.Router();
router.post('/create', createCourse);
router.get('/all', getallCourses);
router.get('/:courseId', getCourse);
router.delete('/delete/:courseId', deleteCourse);



module.exports = router