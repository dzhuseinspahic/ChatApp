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

const getUserById = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await userModel.findById(userId);
        
        if (!user) return res.status(400).json('Cannot find user with this id.');

        res.status(200).json(user);
    } catch(error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password) return res.status(400).json("All fields are required.");

        const user = await userModel.findOne({email: email});
        
        const emailPattern = /[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) return res.status(400).json("Invalid email address.");

        if (user) return res.status(400).json("User with this email already exists.");

        const username = generateUsername("", length=15);
        const newUser = new userModel({
            name: name,
            email: email,
            username: username,
            password: password
        });

        await newUser.save();

        const token = jwt.sign({userId: newUser._id, username: newUser.username}, process.env.JWT_SECRET_KEY, {expiresIn: "10h"});

        res.cookie('token', token, {
            httpOnly: true,
            secure: true
        }).status(200).json({_id: newUser._id, name, email, username, token});
    } catch(error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        if (!username || !password) return res.status(400).json("All fields are required.");

        const user = await userModel.findOne({username: username});
        
        if (!user) return res.status(400).json("Invalid username or password.");

        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) return res.status(400).json("Invalid password.");

        const token = jwt.sign({userId: user._id, username: user.username}, process.env.JWT_SECRET_KEY, {expiresIn: "10h"});

        res.cookie('token', token, {
            httpOnly: true,
            secure: true
        }).status(200).json({
            _id: user._id, 
            name: user.name, 
            email: user.email, 
            username: user.username});
    } catch(error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const logoutUser = (req, res) => {
    res.clearCookie('token').status(200).json('User logged out.');
}

module.exports = {findUserByUsername, getUserById, registerUser, loginUser, logoutUser};