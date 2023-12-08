const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./models/db');
const User = require('./models/user');
const Message = require('./models/message');

dotenv.config();
connectDB();
const app = express();

app.use(express.static('public'));


app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`);
  });