const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true
  },
  question: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: true
  },
  answer: String,
});

const examSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  title: String,
  questions: [questionSchema],
  year: Number,
}, {
  timestamps: true
});

module.exports = mongoose.model('Exam', examSchema);