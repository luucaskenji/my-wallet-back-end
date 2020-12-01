const { verifyIfEmailExists, createUser } = require('../repositories/usersRepository');

async function signUp(req, res) {
    const { name, email, password } = req.body;

    const isRepeated = await verifyIfEmailExists(email);

    if (isRepeated === 'Error') return res.sendStatus(500).send('Internal server error')
    else if (isRepeated === true) return res.sendStatus(409).send('Email already in use');

    const createdUser = await createUser({ name, email, password });
    
    if (createdUser === 'Error') return res.sendStatus(500).send('Internal server error');

    res.status(200).send(createdUser);
}

module.exports = { signUp };