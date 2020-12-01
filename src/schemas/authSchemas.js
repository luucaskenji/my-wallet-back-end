const joi = require('joi');

const signUp = joi.object({
    name: joi.string().pattern(/^[a-zA-Zà-úÀ-Ú\s]*$/).required(),
    email: joi.string().email().required(),
    password: joi.string().pattern(/^[a-zA-Z0-9]*$/).required(),
    passwordConfirmation: joi.ref('password')
});

const signIn = joi.object({
    email: joi.string().email().required(),
    password: joi.string().pattern(/^[a-zA-Z0-9]*$/).required()
});

module.exports = { signUp, signIn }