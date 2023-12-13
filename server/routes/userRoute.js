const express = require('express');
const { registerUser, loginUser, logoutUser, getUserById } = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/:userId', verifyToken, getUserById);
router.post('/logout', verifyToken, logoutUser);

module.exports = router;