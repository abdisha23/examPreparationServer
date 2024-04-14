const express = require('express');
const {
    createForum, 
    deleteForum,
    getForumById,
    getallForums,
    updateForum,
    deleteForumReply
    } = require('../controllers/forumCtrl');
const {authMiddleware, isAdmin} = require('../middlewares/authMiddleware');
const router = express.Router()
router.post('/create', createForum);
router.delete('/delete/:forumId', deleteForum);
router.delete('/delete/:forumId/reply/:forumRepId', deleteForumReply);
router.put('/update/:ForumId', updateForum);
router.get('/get/:forumId', getForumById);
router.get('/all', getallForums);


module.exports = router