const AsyncHandler = require('express-async-handler');
const Course = require('../models/Course'); // Assuming Course model is imported
const Exam = require('../models/Exam'); // Assuming Exam model is imported

const createExam = AsyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { examData } = req.body;

  try {
    // Check if the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'No course found with that id!' });
    }

    // Check if an exam for this course and year already exists
    const existingExam = await Exam.findOne({ course: courseId, 'exam.year': examData.year });
    if (existingExam) {
      return res.status(400).json({ error: 'An exam for this course and year already exists!' });
    }

    // Create the exam
    const exam = await Exam.create({
      course: courseId,
      exam: {
        title: examData.title,
        questions: examData.questions,
        year: examData.year
      }
    });

    res.status(201).json(exam);
  } catch (error) {
    console.error('Error creating exam:', error);
    res.status(500).json({ error: 'Failed to create exam' });
  }
});

module.exports = createExam;
