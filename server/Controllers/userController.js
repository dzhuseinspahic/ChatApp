const userModel = require('../models/userModel');
const { generateUsername } = require("unique-username-generator");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const findUserByUsername = async (username) => {
    try {
        const user = await userModel.findOne({username: username});
        return user;
    } catch(error) {
        console.log(error);
    }
}

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const user = await userModel.findOne({email: email});
        
        if (!name || !email || !password) return res.status(400).json("All fields are required.");

        const emailPattern = /[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) return res.status(400).json("Invalid email address.");

        if (user) return res.status(400).json("User with this email already exists.");

        const username = generateUsername("", 1, length=20);
        const newUser = new userModel({
            name: name,
            email: email,
            username: username,
            password: password
        });

        await newUser.save();

        const token = jwt.sign({userId: newUser._id}, process.env.JWT_SECRET_KEY, {expiresIn: "10h"});

        res.status(200).json({_id: newUser._id, name, email, username, token});
    } catch(error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await userModel.findOne({username: username});
        
        if (!user) return res.status(400).json("Invalid username or password.");

        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) return res.status(400).json("Invalid password.");

        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: "10h"});
        
        res.status(200).json({
            _id: user._id, 
            name: user.name, 
            email: user.email, 
            username: user.username, 
            token: token});
    } catch(error) {
        console.log(error);
        res.status(500).json(error);
    }
}

module.exports = {findUserByUsername, registerUser, loginUser};