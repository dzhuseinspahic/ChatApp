const express = require('express');
const http = require('http');
const dotenv = require('dotenv').config();
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const mustache = require('mustache');
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
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/message', messageRoute);
app.use('/api/chat', chatRoute);
app.use('/api/user', userRoute);

app.get('/', (req, res) => {
    const template = fs.readFileSync('./client/views/signIn.mustache').toString('UTF-8');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(mustache.render(template));
});

app.get('/chat', (req, res) => {
    const template = fs.readFileSync('./client/views/chat.mustache').toString('UTF-8');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(mustache.render(template));
});

httpServer.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`);
  });