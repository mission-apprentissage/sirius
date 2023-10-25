const Joi = require("joi");

const createTemoignageSchema = Joi.object({
  campagneId: Joi.string().required(),
  reponses: Joi.object().required(),
  lastQuestionAt: Joi.date().required(),
});

const updateTemoignageSchema = Joi.object({
  reponses: Joi.object().required(),
  lastQuestionAt: Joi.date().required(),
});

module.exports = { createTemoignageSchema, updateTemoignageSchema };
