const joi = require('joi');

const signUp = joi.object({
    name: joi.string().pattern(/^[a-zA-Zà-úÀ-Ú\s]*$/),
    email: joi.string().email().required(),
    password: joi.string().pattern(/^[a-zA-Z0-9]*$/),
    passwordConfirmation: joi.ref('password')
});

module.exports = { signUp }