const Joi = require("joi");

const createFormationSchema = Joi.object({
  data: Joi.object().required(),
  campagneId: Joi.string().required(),
  createdBy: Joi.string().required(),
});

const updateFormationSchema = Joi.object({
  campagneId: Joi.string().required(),
});

const alreadyExistingFormationSchema = Joi.array().items(Joi.string().required()).required();

module.exports = { createFormationSchema, updateFormationSchema, alreadyExistingFormationSchema };
