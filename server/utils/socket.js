const {saveMessageToDb} = require('../controllers/messageController');
const {findUserByUsername} = require('../controllers/userController');

function socket(io) {
    io.on('connection', (socket) => {
        console.log('conn', io.engine.clientsCount);
    
        socket.on('join-user', (data) => {
            //save to active users

            socket.join(data.chatId);
            io.to(data.chatId).emit('join-user', {
                username: data.username,
                senderSocketId: socket.id
            });
        })

        socket.on('message', async (data) => {
            try {
                const user = await findUserByUsername(data.username);
                const messageDb = await saveMessageToDb(user._id, data.chatId, data.message)
                
                io.to(data.chatId).emit('message', {
                    username: user.username,
                    time: messageDb.timestamp, 
                    message: messageDb.text,
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