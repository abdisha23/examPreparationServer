const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  subject: {
    type: String,
    // required: true
  },
  title: {
    type: String,
    // required: true
  },
  description: {
    type: String,
    // required: true
  },
  file: {
      data: Buffer,
      contentType: String,
      filename: String
      
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Material', materialSchema);
