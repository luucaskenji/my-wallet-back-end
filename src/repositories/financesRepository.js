const { connectionToDB } = require('../database');

async function postFinanceInDB(value, description, authorId) {
    let postedFinance;
    const type = value > 0 ? 'Income' : 'Expense';

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

module.exports = { postFinanceInDB }