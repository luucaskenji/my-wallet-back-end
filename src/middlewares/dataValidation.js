const authSchemas = require('../schemas/authSchemas');

function signUp(req, res, next) {
    const { name, email, password, passwordConfirmation } = req.body;

    if (!name || !email || !password || !passwordConfirmation) return res.sendStatus(400);

    const { error } = authSchemas.signUp.validate(req.body);
    if (error) return res.status(422).send(error.details[0].message);

    next();
}

function signIn(req, res, next) {
    const { email, password } = req.body;

    if (!email || !password) return res.sendStatus(400);

    const { error } = authSchemas.signIn.validate(req.body);
    if (error) return res.status(422).send(error.details[0].message);

    next();
}

module.exports = { signUp, signIn }