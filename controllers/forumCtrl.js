const AsyncHandler = require('express-async-handler');
const Forum = require('../models/forumModel.js');

const createForum = AsyncHandler(async (req, res) => {
  try {
    const {subject, title, post, postedBy, postReplies} = req.body;
    // const postedBy = req.user._id;
    const forum = await Forum.create({subject, title, post, postedBy, postReplies});
    res.status(201).json(forum);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Failed to create Forum' });
  }
});
const getallForums = AsyncHandler(async (req, res) => {
  try {
    const forum = await Forum.find();
    res.status(200).json(forum);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Failed to load forums!' });
  }
});
const getForumById = AsyncHandler(async (req, res) => {
    const forumId = req.params.forumId;
  try {
    const forum = await Forum.findById(forumId);
    console.log(forumId)
    if(!forum){
        return res.status(404).json({ error: 'Forum not found with this id!' });
    }
    res.status(200).json(forum);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Failed to load the Forum!' });
  }
});
const deleteForum = AsyncHandler(async (req, res) => {
    const forumId = req.params.forumId;
    try {
      // Delete the Forum directly
      const deletedForum = await Forum.findByIdAndDelete(forumId);
      if (!deletedForum) {
        return res.status(404).json({ error: 'Forum not found with this id!' });
      }
      res.status(200).json(deletedForum);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to delete the Forum!' });
    }
  });
const deleteForumReply = AsyncHandler(async (req, res) => {
    const {forumId, forumRepId} = req.params;
    try {
      // Delete the Forum directly
      const forum = await Forum.findById(forumId);
      if (!forum) {
        return res.status(404).json({ error: 'Forum not found with this id!' });
      }
      const forumReplyIndex = forum.postReplies.findIndex((q) => q._id.toString() === forumRepId);
      if (forumReplyIndex === -1) {
        return res.status(404).json({ error: 'Reply not found with this id!' });
      }
  
      // Remove the question from the exam's questions array
      const deletedReply = forum.postReplies.splice(forumReplyIndex, 1)[0];
  
      // Save the updated exam
      await forum.save();
  
      // Return the deleted question
      return res.status(200).json(deletedReply);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to delete the forum reply!' });
    }
  });
const updateForum = AsyncHandler(async (req, res) => {
    try {
      const {forumId, questionId} = req.params;
      const updatedForumPost = req.body.post; // Assuming the updated questions are sent in the request body
      const forum = await Forum.findById(forumId);
      if (!forum) {
        return res.status(404).json({ error: 'Forum not found with this id!' });
      }
  
      // Update the existing questions
      forum.post = updatedForumPost;
  
      await forum.save();

      return res.status(200).json({ message: 'Forum updated successfully!' });
    } catch (error) {
        console.log(error);
      return res.status(500).json({ error: 'Failed to update the Forum!' });
    }
  });

module.exports = { 
    createForum, 
    getallForums, 
    getForumById, 
    updateForum,
    deleteForumReply, 
    deleteForum};