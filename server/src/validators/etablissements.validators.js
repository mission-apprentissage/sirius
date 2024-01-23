const Joi = require("joi");

const etablissementSchema = Joi.object({
  data: Joi.object().required(),
  formationIds: Joi.array(),
  createdBy: Joi.string().required(),
});

const createEtablissementSchema = Joi.array().items(etablissementSchema).required().min(1);

const updateEtablissementSchema = Joi.object({
  formationIds: Joi.array().required(),
});

module.exports = { createEtablissementSchema, updateEtablissementSchema };
