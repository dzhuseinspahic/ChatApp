const express = require('express');
const http = require('http');
const dotenv = require('dotenv').config();
const path = require('path');
const socketIO = require('socket.io');
const db = require('./models/db');
const messageRoute = require('./routes/messageRoute');
const chatRoute = require('./routes/chatRoute');
const userRoute = require('./routes/userRoute');

db.connectDB(); 
db.createGlobalChat();

const app = express();
const httpServer = http.createServer(app);
const io = socketIO(httpServer);
/*const io = new socketIO.Server(httpServer, {
    cors: {
        origin: "*"
    },
}); */
require('./utils/socket')(io);

app.use(express.static(path.join(__dirname, '../client/public')));
app.use(express.json());
app.use('/api/message', messageRoute);
app.use('/api/chat', chatRoute);
app.use('/api/user', userRoute);

app.set('views', path.join(__dirname,'../client/views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('signin');
});



httpServer.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`);
  });