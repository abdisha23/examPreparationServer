const express = require('express');
// const upload = require('../utils/multerConfig.js');
// upload.single("file"),
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
const {authMiddleware, isAdmin, isSME} = require('../middlewares/authMiddleware');
const router = express.Router();
router.post('/create/:courseId', authMiddleware, isSME, createCourseMaterial);
router.delete('/delete/:courseId', authMiddleware, isSME, deleteCourseMaterial);
router.post('/material/upload/:courseId', authMiddleware, isSME, uploadFile);
router.get('/material/getall/:courseId', getallFiles);
router.get('/material/get/:courseId/file/:fileId', getFileById);
router.put('/material/update/:courseId/file/:fileId', authMiddleware, isSME, updateFile);
router.delete('/material/delete/:courseId/file/:fileId', authMiddleware, isSME, deleteFile);



module.exports = router