const express = require('express');

const {
    createCourseMaterial,
    deleteCourseMaterial,
    uploadFile, 
    getallFiles,
    getFileById,
    updateFile,
    deleteFile,
    deleteAllFiles    

    } = require('../controllers/fileCtrl');
const {authMiddleware, isAdmin} = require('../middlewares/authMiddleware');
const router = express.Router();
router.post('/create/:courseId', createCourseMaterial);
router.delete('/delete/:courseId', deleteCourseMaterial);
router.post('/material/upload/:courseId', uploadFile);
router.get('/material/getall/:courseId', getallFiles);
router.get('/material/get/:courseId/file/:fileId', getFileById);
router.put('/material/update/:courseId/file/:fileId', updateFile);
router.delete('/material/delete/:courseId/file/:fileId', deleteFile);



module.exports = router