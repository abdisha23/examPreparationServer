const express = require('express');
const {
    createMaterial, 
    deleteMaterial,
    // loginMaterial,
    // blockMaterial,
    // unblockMaterial,
    // loginAdmin,
    // logoutMaterial,
    addQuestion,
    updateQuestion,
    getMaterialById,
    getallMaterials,
    deleteQuestion
    // forgotPassword,
    // resetPassword
    } = require('../controllers/materialCtrl');
const {authMiddleware, isAdmin} = require('../middlewares/authMiddleware');
const router = express.Router()
router.post('/create', createMaterial);
// router.delete('/delete/:MaterialId', deleteMaterial);
// router.delete('/delete/:MaterialId/question/:questionId', deleteQuestion);
// // router.put('/block/:id', blockMaterial);
// // router.put('/unblock/:id', unblockMaterial);
// router.put('/add/:MaterialId', addQuestion);
// // router.get('/logout-Material', logoutMaterial);
// // router.get('/logout-admin', logoutAdmin);
// router.put('/update/:MaterialId', updateQuestion);
// router.get('/get/:id', getMaterialById);
// router.get('/all', getallMaterials);
// // router.post('/forgot-password', forgotPassword);
// // router.post('/reset-password/:token', resetPassword);

module.exports = router