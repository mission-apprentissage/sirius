const Joi = require("joi");

const createFormationSchema = Joi.object({
  data: Joi.object().required(),
  campagneIds: Joi.array(), //.required(),
  createdBy: Joi.string().required(),
});

const updateFormationSchema = Joi.object({
  data: Joi.object().required(),
  campagneIds: Joi.array().required(),
});

module.exports = { createFormationSchema, updateFormationSchema };
