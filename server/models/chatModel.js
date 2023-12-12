const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    userIds: {
        type: Array
    },
    type: {
        type: String,
        default: 'private',
        enum: ['private', 'global']
    }
});

const chatModel = mongoose.model("Chat", chatSchema);

module.exports = chatModel;