const Joi = require('@hapi/joi');

module.exports.PlanValidationSchema = Joi.object().keys({
    name: Joi.string().required(),
    price: Joi.number().integer().positive().allow(0).required(),
    type: Joi.string().valid("monthly", "yearly").required(),
    userId: Joi.number().positive().required()
})