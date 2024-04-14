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
  description: String
});

const examSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true
  },
  title: String,
  questions: [questionSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Exam', examSchema);