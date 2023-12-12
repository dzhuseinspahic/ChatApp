const express = require("express");
const {createChat, findChatById, getGlobalChatId, addUserToChat} = require("../controllers/chatController");

const router = express.Router();

router.post('/', createChat);
router.patch('/addUser', addUserToChat);
router.get('/:chatId', findChatById);
router.get('/:userId/globalId', getGlobalChatId);

module.exports = router;