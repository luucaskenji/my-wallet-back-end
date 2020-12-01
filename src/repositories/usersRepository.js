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
        return { statusCode: 500, message: 'Internal server error'};
    }

    const createdUser = { id: creationResult.id, name, email };

    return { statusCode: 200, content: createdUser };
}

async function verifyIfEmailExists(email) {
    let results;

    try {
        results = await connectionToDB.query('SELECT * FROM users WHERE email = $1', [email]);
    }
    catch {
        return { statusCode: 500, message: 'Internal server error'};
    }
    
    return results.rows.length > 0 
        ? { statusCode: 409, message: 'Email already in use'} 
        : { statusCode: 200 };
}

async function authenticateUser(email, password) {
    let foundUser;

    try {
        results = await connectionToDB.query('SELECT * FROM users WHERE email = $1', [email]);
        foundUser = results.rows[0];
    }
    catch {
        return { statusCode: 500, message: 'Internal server error'};
    }

    if (!foundUser) return { statusCode: 404, message: 'User not found'};

    const passwordIsCorrect = bcrypt.compareSync(password, foundUser.password);

    return passwordIsCorrect 
        ? { statusCode: 200, content: foundUser}
        : { statusCode: 401, message: 'Wrong password'};
}

module.exports = { verifyIfEmailExists, createUser, authenticateUser };