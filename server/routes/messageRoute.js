const express = require("express");
const {createMessage, getMessagesByChatId} = require("../controllers/messageController");

const router = express.Router();

router.post("/", createMessage);
router.get("/:chatId", getMessagesByChatId);

module.exports = router;