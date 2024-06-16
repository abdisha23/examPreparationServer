const AsyncHandler = require('express-async-handler');
const Course = require('../models/courseModel.js');
const Quiz = require('../models/quizModel.js');

const createQuiz = AsyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { quizData } = req.body;

  try {

    const createdQiuzzes = [];

    for (const quiz of quizData) {
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ error: 'No course found with that id!' });
      }
      const existingQuiz = await Quiz.findOne({ course: courseId});
      if (existingQuiz) {
        return res.status(400).json({ error: `An quiz for course ${courseId} and year ${quiz.year} already exists!` });
      }

      const createdQiuz = await Quiz.create({
        course: courseId,
        quiz: {
          title: quiz.title,
          questions: quiz.questions,
          year: quiz.year
        }
      });

      createdQiuzzes.push(createdQiuz);
    }

    res.status(201).json(createdQiuzzes);
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ error: 'Failed to create quiz' });
  }
});

const getallQuizzes = AsyncHandler(async (req, res) => {
  const {courseId} = req.params;
  try {
    const existingQuizzes = await Quiz.find({course: courseId}); 
    if (!existingQuizzes) {
      return res.status(404).json('No exams found for this course!');
    }
    console.log(existingQuizzes)
    res.status(200).json(existingQuizzes);
  } catch (error) {
    console.error('Error loading quizzes:', error);
    res.status(500).json({ error: 'Failed to load quizzes!' });
  }
});

const getQuizById = AsyncHandler(async (req, res) => {
    const quizId = req.params.quizId;
  try {
    const quiz = await Quiz.findById(quizId);
    if(!quiz){
        return res.status(404).json({ error: 'Quiz not found with this id!' });
    }
    res.status(200).json(quiz);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Failed to load the Quiz!' });
  }
});
const deleteQuiz = AsyncHandler(async (req, res) => {
    const quizId = req.params.quizId;
    try {
      // Delete the Quiz directly
      const deletedQuiz = await Quiz.findByIdAndDelete(quizId);
      if (!deletedQuiz) {
        return res.status(404).json({ error: 'Quiz not found with this id!' });
      }
      res.status(200).json(deletedQuiz);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to delete the Quiz!' });
    }
  });
const updateQuizQuestion = AsyncHandler(async (req, res) => {
    try {
      const {quizId, questionId} = req.params;
      const updatedQuestion = req.body.questions; // Assuming the updated questions are sent in the request body
      const quiz = await Quiz.findById(quizId);
      if (!quiz) {
        return res.status(404).json({ error: 'Quiz not found with this id!' });
      }
  
      // Update the existing questions
      quiz.questions = quiz.questions.map((question) => {
        const findQuestion = (questionId === question._id.toString());
        if (findQuestion) {
          question.question = updatedQuestion.question;
          question.options = updatedQuestion.options;
          question.answer = updatedQuestion.answer;
        }
        return question;
      });
  
      await quiz.save();

      return res.status(200).json({ message: 'Quiz updated successfully!' });
    } catch (error) {
        console.log(error);
      return res.status(500).json({ error: 'Failed to update the quiz!' });
    }
  });
  const deleteQuizQuestion = AsyncHandler(async (req, res) => {
    try {
      const {quizId, questionId} = req.params;
  
      // Find the Quiz
      const quiz = await Quiz.findById(quizId);
      if (!quiz) {
        return res.status(404).json({ error: 'Quiz not found with this id!' });
      }
  
      // Find the index of the question to be deleted
      const questionIndex = quiz.questions.findIndex((q) => q._id.toString() === questionId);
      if (questionIndex === -1) {
        return res.status(404).json({ error: 'Question not found with this id!' });
      }
  
      // Remove the question from the Quiz's questions array
      const deletedQuestion = quiz.questions.splice(questionIndex, 1)[0];
  
      // Save the updated Quiz
      await quiz.save();
  
      // Return the deleted question
      return res.status(200).json(deletedQuestion);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Failed to delete the question!' });
    }
  });

  const addQuizQuestion = AsyncHandler(async(req, res) => {
    const quizId = req.params.quizId;
    let newQuestions = req.body.questions;
    const quiz = await Quiz.findById(quizId);

if (!quiz) {
  return res.status(404).json({ error: 'Quiz not found' });
}

const currentQuestions = quiz.questions;

const updatedQuestions = [...currentQuestions, ...newQuestions]; // Merge existing and new questions, or apply desired modifications

quiz.questions = updatedQuestions;

try {
  await quiz.save();
  return res.status(200).json({ message: 'Quiz updated successfully' });
} catch (error) {
  return res.status(500).json({ error: 'Failed to update Quiz' });
}

  })
module.exports = { 
    createQuiz, 
    getallQuizzes, 
    getQuizById, 
    updateQuizQuestion, 
    addQuizQuestion, 
    deleteQuiz,
    deleteQuizQuestion };