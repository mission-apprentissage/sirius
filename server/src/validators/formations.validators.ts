import Joi from "joi";

export const createFormationSchema = Joi.object({
  data: Joi.object().required(),
  campagneId: Joi.string().required(),
  createdBy: Joi.string().required(),
});

export const updateFormationSchema = Joi.object({
  campagneId: Joi.string().required(),
});
