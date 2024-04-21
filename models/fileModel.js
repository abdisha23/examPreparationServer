const mongoose = require('mongoose');

const courseMaterialSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  files: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
        required: false
      },
      title: String,
      description: String,
      file: {
        url: String, 
        public_id: String, 
        contentType: String,
        filename: String
      },
    },
  ],
}, {
  timestamps: true,
});

module.exports = mongoose.model('CourseMaterial', courseMaterialSchema);