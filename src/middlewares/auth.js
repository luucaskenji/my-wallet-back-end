const { findUserSession } = require('../repositories/sessionsRepository');
const { getUserDataById } = require('../repositories/usersRepository');

async function authMiddleware(req, res, next) {
    let session, user;

    const authenticationHeader = req.header('Authorization');
    if (!authenticationHeader) return res.status(401).send('Header de autorização não encontrado');

    const token = authenticationHeader.split(' ')[1];
    const findSessionResponse = await findUserSession(token);

    if (findSessionResponse.statusCode === 500) {
        return res.status(500).send(findSessionResponse.message);
    }
    else session = findSessionResponse.content;
    
    const getUserResponse = await getUserDataById(session.userId);

    if (getUserResponse.statusCode !== 200) {
        return res.status(getUserResponse.statusCode).send(getUserResponse.message)
    }
    else user = getUserResponse.content;

    req.user = user;
    
    next();
}

module.exports = { authMiddleware }