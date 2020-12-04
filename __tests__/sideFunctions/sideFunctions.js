const { v4: uuidv4 } = require('uuid');
const { connectionToDB } = require('../../src/database');

const cleanDB = async () => {
    let testUser;
    const result = await connectionToDB.query("SELECT * FROM users WHERE name = 'automated test'");
    
    if (!result.rows[0]) return;
    else testUser = result.rows[0];

    await connectionToDB.query("DELETE FROM users WHERE name = 'automated test'");
    await connectionToDB.query("DELETE FROM users WHERE name = 'Fulano'");
    await connectionToDB.query(`DELETE FROM sessions WHERE "userId" = ${testUser.id}`);
    await connectionToDB.query(`DELETE FROM finances WHERE "authorId" = ${testUser.id}`);
};

const getValidToken = async () => {
    const signUpBody = {
        name: 'automated test',
        email: 'automated-test@gmail.com',
        password: '123456'
    };
    let insertionArray = [signUpBody.name, signUpBody.email, signUpBody.password];
    
    const response = await connectionToDB.query(
        `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *`, 
        insertionArray
    );
    const testUserId = response.rows[0].id;
    
    const token = uuidv4();
    insertionArray = [testUserId, token]

    await connectionToDB.query(
        `INSERT INTO sessions ("userId", token) VALUES ($1, $2)`,
        insertionArray
    );

    return token;
};

module.exports = { cleanDB, getValidToken };