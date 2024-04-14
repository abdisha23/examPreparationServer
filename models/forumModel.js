const mongoose = require('mongoose');

const forumSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  post: {
    type: String,
    required: true
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  postReplies: [
    {
      title: {
        type: String,
        required: true
      },
      postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      }
    }
  ]
},
{
  timestamps: true
});

module.exports = mongoose.model('Forum', forumSchema);