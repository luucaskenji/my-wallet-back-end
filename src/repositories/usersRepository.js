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
        return { statusCode: 500, message: 'Erro no servidor'};
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
        return { statusCode: 500, message: 'Erro no servidor'};
    }
    
    return results.rows.length > 0 
        ? { statusCode: 409, message: 'Email já cadastrado'} 
        : { statusCode: 200 };
}

async function authenticateUser(email, password) {
    let foundUser;

    try {
        results = await connectionToDB.query('SELECT * FROM users WHERE email = $1', [email]);
        foundUser = results.rows[0];
    }
    catch {
        return { statusCode: 500, message: 'Erro no servidor'};
    }

    if (!foundUser) return { statusCode: 404, message: 'Usuário não encontrado'};

    const passwordIsCorrect = bcrypt.compareSync(password, foundUser.password);

    return passwordIsCorrect 
        ? { statusCode: 200, content: foundUser}
        : { statusCode: 401, message: 'Senha incorreta' };
}

async function getUserDataById(id) {
    let foundUser;

    try {
        const response = await connectionToDB.query('SELECT * FROM users WHERE id = $1', [id]);
        foundUser = {...response.rows[0]};
        delete foundUser.password;
    }
    catch {
        return { statusCode: 500, message: 'Erro no servidor' };
    }

    if (!foundUser) {
        return { statusCode: 403, message: 'Não autorizado' }
    }
    else {
        return { statusCode: 200, content: foundUser }
    }    
}

module.exports = { verifyIfEmailExists, createUser, authenticateUser, getUserDataById };