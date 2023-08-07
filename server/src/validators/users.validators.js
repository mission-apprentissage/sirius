const Joi = require("joi");

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const subscribeSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  comment: Joi.string(),
  siret: Joi.string().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
  etablissement: Joi.object().required(),
});

const updateSchema = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  siret: Joi.string(),
  username: Joi.string(),
  password: Joi.string(),
  etablissement: Joi.object(),
  status: Joi.string(),
  role: Joi.string(),
});

module.exports = { loginSchema, subscribeSchema, updateSchema };
