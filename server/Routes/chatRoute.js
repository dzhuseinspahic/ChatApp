const express = require("express");
const {createChat, findChatById} = require("../Controllers/chatController");

const router = express.Router();

router.post("/", createChat);
router.get("/:chatId", findChatById);

module.exports = router;