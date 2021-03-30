const joi = require('joi');

const moneyOperations = joi.object({
    value: joi.string().pattern(/^[0-9]+\,{1}[0-9]{2}$/).required(),
    description: joi.string().allow(''),
    type: joi.string().required()
});

module.exports = { moneyOperations };