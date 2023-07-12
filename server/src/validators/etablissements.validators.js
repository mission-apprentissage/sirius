const Joi = require("joi");

const createEtablissementSchema = Joi.object({
  data: Joi.object().required(),
  formationIds: Joi.array(), //.required(),
  createdBy: Joi.string().required(),
});

const updateEtablissementSchema = Joi.object({
  data: Joi.object().required(),
  formationIds: Joi.array().required(),
});

module.exports = { createEtablissementSchema, updateEtablissementSchema };
