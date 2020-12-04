const { connectionToDB } = require('../database');

async function getFinancesByUserId(userId) {
    let userFinances;

    try {
        const response = await connectionToDB.query(
            'SELECT * FROM finances WHERE "authorId" = $1',
            [userId]
        );

        userFinances = response.rows;
    }
    catch {
        return { statusCode: 500, message: 'Erro no servidor' };
    }

    return { statusCode: 200, content: userFinances };
}

async function postFinanceInDB(value, description, type, authorId) {
    let postedFinance;

    try {
        const creationResponse = await connectionToDB.query(
            'INSERT INTO finances ("authorId", type, value, description) VALUES ($1, $2, $3, $4) RETURNING *',
            [authorId, type, value, description]
        );

        postedFinance = creationResponse.rows[0];
    }
    catch {
        return { statusCode: 500, message: 'Erro no servidor' };
    }

    return { statusCode: 201, content: postedFinance };
}

module.exports = { getFinancesByUserId, postFinanceInDB }