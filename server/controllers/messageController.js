const messageModel = require("../models/messageModel");

const createMessage = async (req, res) => {
    const {chatId, senderId, text} = req.body;

    try{
        const message = new messageModel({
            chatId,
            senderId,
            text
        });
    
        const response = await message.save();

        res.status(200).json(response);
    } catch(error) {
        console.log(error);
        res.status(500).json(error);
    }
};

const getMessagesByChatId = async (req, res) => {
    const { chatId } = req.params;
    const page = req.query.page;
    const pageSize = 30;
    const skip = (page - 1) * pageSize;

    try {
        const messages = await messageModel
            .find({ chatId: chatId })
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(pageSize);
        
        res.status(200).json(messages);
    } catch(error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const saveMessageToDb = async (senderId, chatId, text) => {
    try {
        const message = new messageModel({
            chatId,
            senderId,
            text
        });
    
        const response = await message.save();
        return response;
    } catch(error) {
        console.log(error);
    }
}

module.exports = {createMessage, getMessagesByChatId, saveMessageToDb};