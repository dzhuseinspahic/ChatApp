const express = require("express");
const {createMessage, getMessagesByChatId} = require("../controllers/messageController");
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post("/", verifyToken, createMessage);
router.get("/:chatId", verifyToken, getMessagesByChatId);

module.exports = router;