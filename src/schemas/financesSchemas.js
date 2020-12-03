const joi = require('joi');

const income = joi.object({
    value: joi.string().pattern(/^[0-9]+\,{1}[0-9]{2}$/).required(),
    description: joi.string()
});

module.exports = { income };