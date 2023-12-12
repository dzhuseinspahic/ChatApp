const { saveMessageToDb, getGlobalMessages } = require('../controllers/messageController');
const { findUserByUsername } = require('../controllers/userController');

var activeUsers = [];

function socket(io) {
    io.on('connection', (socket) => {
        console.log('conn', io.engine.clientsCount);

        socket.on('join-user', (data) => {
            if (activeUsers.indexOf(data.username) === -1) {
                activeUsers.push(data.username);
            }

            socket.join(data.chatId);
            
            io.to(data.chatId).emit('join-user', {
                username: data.username,
                senderSocketId: socket.id
            });

            io.to(data.chatId).emit('active-users', activeUsers);
        })

        socket.on('message', async (data) => {
            try {
                const user = await findUserByUsername(data.username);
                const messageDb = await saveMessageToDb(user._id, data.chatId, data.message)
                
                io.to(data.chatId).emit('message', {
                    username: user.username,
                    timestamp: messageDb.timestamp, 
                    text: messageDb.text,
                });

            } catch(error) {
                console.log(error);
                socket.emit('message', 'Error');
            }
        });
    
    
        
        socket.on('disconnecting', ()=>{

        });
    })
}


module.exports = socket;