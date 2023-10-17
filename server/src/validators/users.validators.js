const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const subscribeSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  comment: Joi.string().allow(null, ""),
  etablissements: Joi.array().required(),
  email: Joi.string().email({ tlds: false }).required(),
  password: passwordComplexity(),
});

const updateSchema = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  siret: Joi.string(),
  email: Joi.string().email(),
  etablissement: Joi.object(),
  status: Joi.string(),
  role: Joi.string(),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email({ tlds: false }).required(),
});

const resetPasswordSchema = Joi.object({
  password: passwordComplexity(),
  token: Joi.string().required(),
});

const confirmSchema = Joi.object({
  token: Joi.string().required(),
});

module.exports = {
  loginSchema,
  subscribeSchema,
  updateSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  confirmSchema,
};
