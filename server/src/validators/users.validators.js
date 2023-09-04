const Joi = require("joi");

const loginSchema = Joi.object({
  username: Joi.string().email().required(),
  password: Joi.string().required(),
});

const subscribeSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  comment: Joi.string(),
  siret: Joi.string().required(),
  username: Joi.string().email().required(),
  password: Joi.string().required(),
  etablissement: Joi.object().required(),
});

const updateSchema = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  siret: Joi.string(),
  username: Joi.string().email(),
  password: Joi.string(),
  etablissement: Joi.object(),
  status: Joi.string(),
  role: Joi.string(),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

const resetPasswordSchema = Joi.object({
  password: Joi.string().required(),
  token: Joi.string().required(),
});

module.exports = { loginSchema, subscribeSchema, updateSchema, forgotPasswordSchema, resetPasswordSchema };
