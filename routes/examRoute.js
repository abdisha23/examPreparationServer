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
router.post('/create', createExam);
router.delete('/delete/:ExamId', deleteExam);
router.delete('/delete/:ExamId/question/:questionId', deleteQuestion);
router.put('/add/:ExamId', addQuestion);
router.put('/update/:ExamId', updateQuestion);
router.get('/get/:id', getExamById);
router.get('/all', getallExams);


module.exports = router