const AsyncHandler = require('express-async-handler');
const Course = require('../models/courseModel.js');
const Exam = require('../models/examModel.js');
 // Assuming Exam model is imported

 const createExam = AsyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { examData } = req.body;

  try {
    // Check if examData is provided and is an array with at least one element
    // if (!Array.isArray(examData) || examData.length === 0) {
    //   return res.status(400).json({ error: 'Invalid exam data provided' });
    // }

    const createdExams = [];

    // Iterate through each exam in examData array
    for (const exam of examData) {
      // Check if the course exists
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ error: 'No course found with that id!' });
      }

      // Check if an exam for this course and year already exists
      const existingExam = await Exam.findOne({ course: courseId, 'exam.year': exam.year });
      if (existingExam) {
        return res.status(400).json({ error: `An exam for course ${courseId} and year ${exam.year} already exists!` });
      }

      // Create the exam
      const createdExam = await Exam.create({
        course: courseId,
        exam: {
          title: exam.title,
          questions: exam.questions,
          year: exam.year
        }
      });

      createdExams.push(createdExam);
    }

    res.status(201).json(createdExams);
  } catch (error) {
    console.error('Error creating exams:', error);
    res.status(500).json({ error: 'Failed to create exams' });
  }
});


const getallExams = AsyncHandler(async (req, res) => {
  const { courseId } = req.params;
  try {
    const existingExams = await Exam.findOne({ course: courseId }).populate({
      path: 'exam',
      populate: {
        path: 'questions'
      }
    });
    
    if (!existingExams) {
      return res.status(404).json('No exams found for this course!');
    }
    console.log(existingExams)
    res.status(200).json(existingExams);
  } catch (error) {
    console.error('Error loading exams:', error);
    res.status(500).json({ error: 'Failed to load exams!' });
  }
});

const getExamById = AsyncHandler(async (req, res) => {
    const examId = req.params.examId;
  try {
    const exam = await Exam.findById(examId);
    if(!exam){
        return res.status(404).json({ error: 'Exam not found with this id!' });
    }
    res.status(200).json(exam);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Failed to load the exam!' });
  }
});
const deleteExam = AsyncHandler(async (req, res) => {
    const examId = req.params.examId;
    try {
      // Delete the exam directly
      const deletedExam = await Exam.findByIdAndDelete(examId);
      if (!deletedExam) {
        return res.status(404).json({ error: 'Exam not found with this id!' });
      }
      res.status(200).json(deletedExam);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to delete the exam!' });
    }
  });
const updateQuestion = AsyncHandler(async (req, res) => {
    try {
      const examId = req.params.examId;
      const updatedQuestions = req.body.questions; // Assuming the updated questions are sent in the request body
      const exam = await Exam.findById(examId);
      if (!exam) {
        return res.status(404).json({ error: 'Exam not found with this id!' });
      }

      // Update the existing questions
      exam.questions = exam.questions.map((currentQuestion) => {
        const updatedQuestion = updatedQuestions.find((q) => q._id.toString() === currentQuestion._id.toString());
        if (updatedQuestion) {
          currentQuestion.question = updatedQuestion.question;
          currentQuestion.options = updatedQuestion.options;
          currentQuestion.answer = updatedQuestion.answer;
        }
        return currentQuestion;
      });

      await exam.save();

      return res.status(200).json({ message: 'Exam updated successfully!' });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update the exam!' });
    }
  });
  const deleteQuestion = AsyncHandler(async (req, res) => {
    try {
      const {examId, questionId} = req.params;

      // Find the exam
      const exam = await Exam.findById(examId);
      if (!exam) {
        return res.status(404).json({ error: 'Exam not found with this id!' });
      }

      // Find the index of the question to be deleted
      const questionIndex = exam.questions.findIndex((q) => q._id.toString() === questionId);
      if (questionIndex === -1) {
        return res.status(404).json({ error: 'Question not found with this id!' });
      }

      // Remove the question from the exam's questions array
      const deletedQuestion = exam.questions.splice(questionIndex, 1)[0];

      // Save the updated exam
      await exam.save();

      // Return the deleted question
      return res.status(200).json(deletedQuestion);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Failed to delete the question!' });
    }
  });

  const addQuestion = AsyncHandler(async(req, res) => {
    const examId = req.params.examId;
    let newQuestions = req.body.questions;
    const exam = await Exam.findById(examId);

if (!exam) {
  return res.status(404).json({ error: 'Exam not found' });
}

const currentQuestions = exam.questions;

const updatedQuestions = [...currentQuestions, ...newQuestions]; // Merge existing and new questions, or apply desired modifications

exam.questions = updatedQuestions;

try {
  await exam.save();
  return res.status(200).json({ message: 'Exam updated successfully' });
} catch (error) {
  return res.status(500).json({ error: 'Failed to update exam' });
}

  })
module.exports = { 
    createExam, 
    getallExams, 
    getExamById, 
    updateQuestion, 
    addQuestion, 
    deleteExam,
    deleteQuestion 
  };




