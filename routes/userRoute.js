const express = require('express');
const {
    createStudent, 
    createSME,
    deleteUser,
    loginUser,
    updateUser,
    blockUser,
    unblockUser,
    loginAdmin,
    logoutAdmin,
    logoutUser,
    getUserById,
    getallUsers,
    forgotPassword,
    resetPassword
    } = require('../controllers/userCtrl');
const {authMiddleware, isAdmin} = require('../middlewares/authMiddleware');
const router = express.Router()
router.post('/signup', createStudent);
router.post('/register', authMiddleware, isAdmin, createSME);
router.delete('/delete/:UserId', authMiddleware, isAdmin,deleteUser);
router.post('/user-login', loginUser);
router.post('/admin-login', loginAdmin);
router.put('/update',authMiddleware, isAdmin,updateUser);
router.put('/block/:userId', authMiddleware, isAdmin, blockUser);
router.put('/unblock/:userId', authMiddleware, isAdmin, unblockUser);
router.get('/logout-user', logoutUser);
router.get('/logout-admin', logoutAdmin);
router.get('/get/:userId', authMiddleware, isAdmin,getUserById);
router.get('/all', getallUsers);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router