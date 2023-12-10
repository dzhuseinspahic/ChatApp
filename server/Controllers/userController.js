const userModel = require("../models/userModel");

const findUserByUsername = async (username) => {
    try {
        const user = await userModel.findOne({username: username});
        return user;
    } catch(error) {
        console.log(error);
    }
}


module.exports = {findUserByUsername};