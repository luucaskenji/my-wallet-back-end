const { postFinanceInDB } = require('../repositories/financesRepository');

async function postIncome(req, res) {
    let { value, description } = req.body;
    const { user } = req;
    
    value = value.replace(',', '.').trim();
    value = parseFloat(value);

    description = description.trim();

    const postResponse = await postFinanceInDB(value, description, user.id);

    return postResponse.statusCode === 500
        ? res.status(500).send(postResponse.message)
        : res.status(201).send(postResponse.content)
}

module.exports = { postIncome }