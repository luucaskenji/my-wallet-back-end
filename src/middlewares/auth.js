const jwt = require('jsonwebtoken');

const usersController = require('../controllers/usersController');
const { AuthError } = require('../errors');

async function authMiddleware(req, res, next) {
    const authenticationHeader = req.header('Authorization');
    if (!authenticationHeader) throw new AuthError('Authorization header not found');

    const token = authenticationHeader.split(' ')[1];

    let sessionId;
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) throw new AuthError('Invalid token');
        sessionId = decoded.id;
    });

    const userId = await usersController.getUserIdBySessionId(sessionId);
    
    req.userId = userId;
    next();
}

module.exports = authMiddleware;