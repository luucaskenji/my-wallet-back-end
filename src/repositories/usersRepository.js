const bcrypt = require('bcrypt');
const { connectionToDB } = require('../database/index');

async function createUser({ name, email, password }) {
    let creationResult;

    const passwordHash = bcrypt.hashSync(password, 10);

    try {
        creationResult = await connectionToDB.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
            [name, email, passwordHash]
        );
    }
    catch {
        return 'Error';
    }

    const createdUser = { id: creationResult.id, name, email };

    return createdUser;
}

async function verifyIfEmailExists(email) {
    let results;

    try {
        results = await connectionToDB.query('SELECT * FROM users WHERE email = $1', [email]);
    }
    catch {
        return 'Error';
    }
    
    return results.rows.length > 0 ? true : false;
}

module.exports = { verifyIfEmailExists, createUser };