const express = require('express');
const http = require('http');
const dotenv = require('dotenv').config();
const socketIO = require('socket.io');
const db = require('./Models/db');
const messageRoute = require('./Routes/messageRoute');
const chatRoute = require('./Routes/chatRoute');

db.connectDB(); 
db.createGlobalChat();

const app = express();
const httpServer = http.createServer(app);
const io = socketIO(httpServer);
/*const io = new socketio.Server(httpServer, {
    cors: {
        origin: [`http://localhost:5500`]
    },
});*/

app.use(express.json());
app.use(express.static('/client'));
app.use('/api/message', messageRoute);
app.use('/api/chat', chatRoute);


io.on('connection', (socket) => {
    console.log('User connected');
    socket.on('message', (msg) => {
        io.emit('message', msg);
        console.log('message' + msg);
    })
    socket.on('disconnect', ()=> {
        console.log('User disconnected');
    })
})

httpServer.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`);
  });