const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const { USER_ROLES } = require("../constants");

const loginSchema = Joi.object({
  email: Joi.string().email({ tlds: false }).required(),
  password: Joi.string().required(),
});

const etablissementSchema = Joi.object({
  _id: Joi.string().required(),
  siret: Joi.string().required(),
  onisep_nom: Joi.string().allow(null, ""),
  enseigne: Joi.string().allow(null, ""),
  entreprise_raison_sociale: Joi.string().allow(null, ""),
});

const subscribeSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  role: Joi.string().allow(USER_ROLES.ETABLISSEMENT, USER_ROLES.OBSERVER).required(),
  comment: Joi.when("role", {
    is: USER_ROLES.OBSERVER,
    then: Joi.string().required(),
    otherwise: Joi.string().allow(null, ""),
  }),
  etablissements: Joi.when("role", {
    is: USER_ROLES.ETABLISSEMENT,
    then: Joi.array().items(etablissementSchema).required().min(1),
    otherwise: Joi.array().max(0),
  }),
  email: Joi.string().email({ tlds: false }).required(),
  password: passwordComplexity({
    min: 8,
    max: 128,
  }),
});

const updateSchema = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  siret: Joi.string(),
  email: Joi.string().email({ tlds: false }),
  etablissements: Joi.array().items(etablissementSchema),
  status: Joi.string(),
  role: Joi.string(),
  acceptedCgu: Joi.boolean(),
  scope: Joi.object({
    field: Joi.string(),
    value: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())),
  }),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email({ tlds: false }).required(),
});

const resetPasswordSchema = Joi.object({
  password: passwordComplexity({
    min: 8,
    max: 128,
  }),
  token: Joi.string().required(),
});

const confirmSchema = Joi.object({
  token: Joi.string().required(),
});

const supportSchema = Joi.object({
  title: Joi.string().required(),
  message: Joi.string().required(),
});

const supportPublicSchema = Joi.object({
  email: Joi.string().required(),
  message: Joi.string().required(),
});

module.exports = {
  loginSchema,
  subscribeSchema,
  updateSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  confirmSchema,
  supportSchema,
  supportPublicSchema,
};
