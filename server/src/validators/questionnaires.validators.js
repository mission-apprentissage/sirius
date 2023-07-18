const Joi = require("joi");

const createQuestionnaireSchema = Joi.object({
  nom: Joi.string().required(),
  questionnaire: Joi.object().required(),
  questionnaireUI: Joi.object().required(),
  createdBy: Joi.string().required(),
});

const updateQuestionnaireSchema = Joi.object({
  nom: Joi.string().required(),
  questionnaire: Joi.object().required(),
  questionnaireUI: Joi.object().required(),
});

module.exports = { createQuestionnaireSchema, updateQuestionnaireSchema };
