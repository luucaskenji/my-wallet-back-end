const { getFinancesByUserId, postFinanceInDB } = require('../repositories/financesRepository');

async function getOperations(req, res) {
    const { user } = req;
    
    const response = await getFinancesByUserId(user.id);
    
    return response.statusCode === 500
        ? res.status(500).send(response.message)
        : res.status(200).send(response.content)
}

async function postOperation(req, res) {
    let { value, description, type } = req.body;
    const { user } = req;
    
    value = value.replace(',', '.').trim();

    value = (type === 'Income') ? parseFloat(value) : parseFloat(value)*(-1);

    description = description.trim();

    const postResponse = await postFinanceInDB(value, description, type, user.id);

    return postResponse.statusCode === 500
        ? res.status(500).send(postResponse.message)
        : res.status(201).send(postResponse.content)
}

module.exports = { getOperations, postOperation }