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
const {authMiddleware, isSME} = require('../middlewares/authMiddleware');
const router = express.Router()
router.post('/create/:courseId', authMiddleware, isSME, createExam);
router.delete('/delete/:examId', authMiddleware, isSME ,deleteExam);
router.delete('/delete/:examId/question/:questionId', authMiddleware, isSME, deleteQuestion);
router.put('/add/:examId', authMiddleware, isSME, addQuestion);
router.put('/update/:examId', authMiddleware, isSME, updateQuestion);
router.get('/get/:id', getExamById);
router.get('/all/:courseId', getallExams);


module.exports = router