const Joi = require("joi");

const createQuestionnaireSchema = Joi.object({
  nom: Joi.string().required(),
  questionnaire: Joi.object().required(),
  questionnaireUI: Joi.object().required(),
  createdBy: Joi.string().required(),
  isValidated: Joi.boolean().default(false),
});

const updateQuestionnaireSchema = Joi.object({
  nom: Joi.string(),
  questionnaire: Joi.object(),
  questionnaireUI: Joi.object(),
  isValidated: Joi.boolean().default(false),
});

module.exports = { createQuestionnaireSchema, updateQuestionnaireSchema };
