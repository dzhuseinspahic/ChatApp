const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    chatId: {
        type: String,
        required: true 
    },
    senderId: {
        type: String,
        required: true 
    },
    text: {
        type: String,
        required: true   
    },
    timestamp: {
        type: Date,
        default: Date.now 
    }
});

const messageModel = mongoose.model("Message", messageSchema);

module.exports = messageModel;