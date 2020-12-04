const { postFinanceInDB } = require('../repositories/financesRepository');

async function postOperation(req, res) {
    let { value, description, type } = req.body;
    const { user } = req;
    
    value = value.replace(',', '.').trim();
    value = parseFloat(value);

    description = description.trim();

    const postResponse = await postFinanceInDB(value, description, type, user.id);

    return postResponse.statusCode === 500
        ? res.status(500).send(postResponse.message)
        : res.status(201).send(postResponse.content)
}

module.exports = { postOperation }