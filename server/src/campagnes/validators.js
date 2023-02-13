const Joi = require("@hapi/joi");

const createCampagneSchema = Joi.object({
  nomCampagne: Joi.string().required(),
  cfa: Joi.string().valid("cfa1", "cfa2", "cfa3").required(),
  formation: Joi.string().valid("formation1", "formation2", "formation3").required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().min(1).required(),
  questionnaire: Joi.object().required(),
  questionnaireUI: Joi.object().required(),
});

module.exports = createCampagneSchema;
