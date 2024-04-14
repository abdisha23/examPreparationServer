const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  file: {
    type:{
    data: {
        type: Buffer,
        
     },// Store the file data as a binary buffer
    contentType: {
        type: String,
        
    filename: {
        type: String,
       
    },
  } // Store the MIME type of the file
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Material', materialSchema);
