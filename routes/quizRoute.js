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
const {authMiddleware, isAdmin} = require('../middlewares/authMiddleware');
const router = express.Router()
router.post('/create/:courseId', createQuiz);
router.delete('/delete/:quizId', deleteQuiz);
router.delete('/delete/:quizId/question/:questionId', deleteQuizQuestion);
router.put('/add/:quizId', addQuizQuestion);
router.put('/update/:quizId/question/:questionId', updateQuizQuestion);
router.get('/get/:quizId', getQuizById);
router.get('/all/:courseId', getallQuizzes);


module.exports = router