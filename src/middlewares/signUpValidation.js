const signUpSchema = require('../schemas/signUpSchema');

function signUpValidation(req, res, next) {
    const { name, email, password, passwordConfirmation } = req.body;

    if (!name || !email || !password || !passwordConfirmation) return res.sendStatus(400);

    const { error } = signUpSchema.signUp.validate(req.body);
    if (error) return res.status(422).send(error.details[0].message);

    next();
}

module.exports = { signUpValidation }