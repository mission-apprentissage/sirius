const Joi = require("joi");

const createEtablissementSchema = Joi.array()
  .items(Joi.object({ _id: Joi.string().required(), siret: Joi.string().required(), userId: Joi.string().required() }))
  .required()
  .min(1);

const updateEtablissementSchema = Joi.object({
  formationIds: Joi.array().required(),
});

module.exports = { createEtablissementSchema, updateEtablissementSchema };
