const express = require("express");
const {createChat, findChatById, getGlobalChatId, addUserToChat} = require("../controllers/chatController");
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', verifyToken, createChat);
router.patch('/addUser', verifyToken, addUserToChat);
router.get('/:chatId', verifyToken, findChatById);
router.get('/:userId/globalId', verifyToken, getGlobalChatId);

module.exports = router;