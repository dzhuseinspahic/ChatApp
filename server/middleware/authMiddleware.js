const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    let token = req.cookies.token;

    if (!token) return res.status(401).json({ error: 'Unauthorized: Token not provided.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userId = decoded.userId; 
        req.username = decoded.username;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ error : 'Unauthorized: Invalid token!' });
    }
}

const verifyTokenSocket = (socket, next) => {
    try {
        const token = socket.handshake.headers.cookie.split("=")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        socket.userId = decoded.userId;
        socket.username = decoded.username;
        next();
    } catch(error) {
        console.log(error);
        return next(new Error('Authentication error.'));
    }
}


module.exports = { verifyToken, verifyTokenSocket }