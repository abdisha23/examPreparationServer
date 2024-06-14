const express = require('express');
const {
    createExam, 
    deleteExam,
    getExamById,
    getallExams,
    updateQuestion,
    addQuestion,
    deleteQuestion
    } = require('../controllers/examCtrl');
const {authMiddleware, isAdmin} = require('../middlewares/authMiddleware');
const router = express.Router()
router.post('/create/:courseId', createExam);
router.delete('/delete/:examId', deleteExam);
router.delete('/delete/:examId/question/:questionId', deleteQuestion);
router.put('/add/:examId', addQuestion);
router.put('/update/:examId', updateQuestion);
router.get('/get/:id', getExamById);
router.get('/all/:courseId', getallExams);


module.exports = router