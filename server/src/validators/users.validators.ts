import Joi from "joi";
import passwordComplexity from "joi-password-complexity";

import { USER_ROLES } from "../constants";

export const loginSchema = Joi.object({
  email: Joi.string().email({ tlds: false }).required(),
  password: Joi.string().required(),
});

export const etablissementSchema = Joi.object({
  _id: Joi.string().required(),
  siret: Joi.string().required(),
  onisep_nom: Joi.string().allow(null, ""),
  enseigne: Joi.string().allow(null, ""),
  entreprise_raison_sociale: Joi.string().allow(null, ""),
});

export const subscribeSchema = Joi.object({
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

export const updateSchema = Joi.object({
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

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email({ tlds: false }).required(),
});

export const resetPasswordSchema = Joi.object({
  password: passwordComplexity({
    min: 8,
    max: 128,
  }),
  token: Joi.string().required(),
});

export const confirmSchema = Joi.object({
  token: Joi.string().required(),
});

export const supportSchema = Joi.object({
  title: Joi.string().required(),
  message: Joi.string().required(),
});

export const supportPublicSchema = Joi.object({
  email: Joi.string().required(),
  message: Joi.string().required(),
});
