const express = require("express");
const {createChat, findChatById} = require("../controllers/chatController");

const router = express.Router();

router.post("/", createChat);
router.get("/:chatId", findChatById);

module.exports = router;