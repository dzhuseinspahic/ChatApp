const mongoose = require('mongoose');
const chatModel = require('../Models/chatModel');
const userModel = require('../Models/userModel');

const connectDB = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        /*{
            useNewUrlParser: true,
            useUnifiedTopology: true} */
        console.log("Database connection established");
    } catch(error) {
        console.log("Database connection failed: ", error.message);
    }
};

const createGlobalChat = async() => {
    try {
        const chat = await chatModel.findOne({type: 'global'}); 

        if (!chat) {
            const userIds = await userModel.find(); //get all users
            const globalChat = new chatModel({
                userIds: userIds.map(object => object.id),
                type: 'global'
            });
            await globalChat.save();
    }
    } catch(error) {
        console.log(error);
        res.status(500).json(error);
    }
}

module.exports = {connectDB, createGlobalChat};