const Joi = require("joi");

const createCampagneSchema = Joi.object({
  nomCampagne: Joi.string().allow(""),
  startDate: Joi.date().required(),
  endDate: Joi.date().min(1).required(),
  questionnaireId: Joi.string().required(),
  seats: Joi.number().min(0).allow(null).required(),
});

const createMultiCampagneSchema = Joi.object({
  etablissementSiret: Joi.string().required(),
  campagnes: Joi.array()
    .items({
      nomCampagne: Joi.string().allow(""),
      startDate: Joi.date().required(),
      endDate: Joi.date().min(1).required(),
      questionnaireId: Joi.string().required(),
      seats: Joi.number().min(0).allow(null).required(),
      formation: Joi.object(),
    })
    .required(),
});

module.exports = { createCampagneSchema, createMultiCampagneSchema };
