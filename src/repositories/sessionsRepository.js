const { v4: uuidv4 } = require('uuid');
const { connectionToDB } = require('../database');

async function createSession(id) {
    const newSession = { userId: id, token: uuidv4() };

    try {
        await connectionToDB.query(
            'INSERT INTO sessions (id, token) VALUES ($1, $2)',
            [id, newSession.token]
        );
    }
    catch {
        return { statusCode: 500, message: 'Internal server error' };
    }

    return { statusCode: 200, content: newSession }
}

module.exports = { createSession }