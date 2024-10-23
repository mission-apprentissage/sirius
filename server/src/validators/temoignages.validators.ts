import Joi from "joi";

export const createTemoignageSchema = Joi.object({
  campagneId: Joi.string().required(),
  reponses: Joi.object().required(),
  lastQuestionAt: Joi.date().required(),
  isBot: Joi.boolean().required(),
});

export const updateTemoignageSchema = Joi.object({
  reponses: Joi.object().required(),
  lastQuestionAt: Joi.date().required(),
  isBot: Joi.boolean().required(),
});
