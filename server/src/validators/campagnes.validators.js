const Joi = require("joi");

const createCampagneSchema = Joi.object({
  nomCampagne: Joi.string().allow(""),
  startDate: Joi.date().required(),
  endDate: Joi.date().min(1).required(),
  questionnaireId: Joi.string().required(),
  seats: Joi.number().min(0).allow(null).required(),
});

const createMultiCampagneSchema = Joi.array()
  .items({
    nomCampagne: Joi.string().allow(""),
    startDate: Joi.date().required(),
    endDate: Joi.date().min(1).required(),
    questionnaireId: Joi.string().required(),
    seats: Joi.number().min(0).allow(null).required(),
    formation: Joi.object(),
    etablissementFormateurSiret: Joi.string().required(),
  })
  .min(1);

module.exports = { createCampagneSchema, createMultiCampagneSchema };
