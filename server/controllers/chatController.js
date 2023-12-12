const chatModel = require("../models/chatModel");

const createChat = async (req, res) => {
    let { userIds, type } = req.body;
    
    if (userIds !== undefined & userIds.length < 2) return res.status(400).json({"Error": "Chat must have at least 2 members!"});
    if (type === 'global') return res.status(422).json({"Validation error" : "You cannot create global chat!"});
    
    try{
        if (type === undefined) type = 'private';
        const chat = await chatModel.find({
            userIds: { $all: userIds },
            type: type
        });
        
        if (chat) return res.status(200).json(chat);
        
        const newChat = new chatModel({
            userIds: userIds,
            type: type
        });

        const response = await newChat.save();
        
        res.status(200).json(response);
    } catch(error) {
        console.log(error);
        res.status(500).json(error);
    }
};

const findChatById = async (req, res) => {
    const { chatId } = req.params;

    try {
        const chat = await chatModel.findById(chatId);

        res.status(200).json(chat);
    } catch(error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const getGlobalChatId = async (req, res) => {
    const { userId } = req.params;

    try {
        const chat = await chatModel.findOne({
            //userIds: {$in : userId},
            type: 'global'
        });

        if (!chat) return res.status(400).json('There is no global chat.');
        
        res.status(200).json({_id: chat._id});
    } catch(error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const addUserToChat = async (req, res) => {
    const { userId, chatId } = req.body;

    try {
        const chat = await chatModel.findOne({ _id: chatId });

        if (!chat) return res.status(400).json('There is no chat with this id.');

        const userInChat = chat.userIds.includes(userId);
        if (userInChat) return res.status(400).json('User is already member of this chat.');

        const result = await chatModel.updateOne(
            { _id: chatId }, 
            { $push : { userIds : userId } });
        
        if (result.modifiedCount === 0) return res.status(400).json('User not added to chat.');

        res.status(200).json('User added to chat.');
    } catch(error) {
        console.log(error);
        res.status(500).json(error);
    }
}

module.exports = {createChat, findChatById, getGlobalChatId, addUserToChat};