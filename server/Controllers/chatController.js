const chatModel = require("../Models/chatModel");

const createChat = async (req, res) => {
    const {userIds, type} = req.body;
    
    if (userIds !== undefined & userIds.length < 2) return res.status(400).json({"Error": "Chat must have at least 2 members!"});
    if (type === 'global') return res.status(422).json({"Validation error" : "You cannot create global chat!"});
    
    try{
        const chat = await chatModel.find({
            userIds: { $all: userIds }
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

const addParticipantsToChat = async (req, res) => {

}

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

module.exports = {createChat, findChatById};