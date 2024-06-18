const express = require('express');
const {
    createQuiz, 
    deleteQuiz,
    getQuizById,
    getallQuizzes,
    updateQuizQuestion,
    addQuizQuestion,
    deleteQuizQuestion
    } = require('../controllers/quizCtrl');
const {authMiddleware, isSME} = require('../middlewares/authMiddleware');
const router = express.Router()
router.post('/create/:courseId', authMiddleware, isSME, createQuiz);
router.delete('/delete/:quizId', authMiddleware, isSME, deleteQuiz);
router.delete('/delete/:quizId/question/:questionId', authMiddleware, isSME, deleteQuizQuestion);
router.put('/add/:quizId', authMiddleware, isSME, addQuizQuestion);
router.put('/update/:quizId/question/:questionId', authMiddleware, isSME, updateQuizQuestion);
router.get('/get/:quizId', getQuizById);
router.get('/all/:courseId', getallQuizzes);


module.exports = router