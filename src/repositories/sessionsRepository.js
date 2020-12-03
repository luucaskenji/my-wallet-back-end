const { v4: uuidv4 } = require('uuid');
const { connectionToDB } = require('../database');

async function createSession(id) {
    const newSession = { userId: id, token: uuidv4() };

    try {
        await connectionToDB.query(
            'INSERT INTO sessions ("userId", token) VALUES ($1, $2)',
            [id, newSession.token]
        );
    }
    catch {
        return { statusCode: 500, message: 'Erro no servidor' };
    }

    return { statusCode: 200, content: newSession }
}

async function findUserSession(token) {
    let foundSession;

    try {
        const response = await connectionToDB.query('SELECT * FROM sessions WHERE token = $1', [token]);
        foundSession = response.rows[0];
    }
    catch {
        return { statusCode: 500, message: 'Erro no servidor' };
    }

    return { statusCode: 200, content: foundSession };
}

module.exports = { createSession, findUserSession }