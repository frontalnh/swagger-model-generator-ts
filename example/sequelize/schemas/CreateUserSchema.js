const Joi = require('joi');

module.exports.CreateUserSchema = Joi.object()
.keys({
  name: Joi.string().required()
});
