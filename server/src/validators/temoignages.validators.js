const Joi = require("joi");

const createTemoignageSchema = Joi.object({
  campagneId: Joi.string().required(),
  reponses: Joi.object().required(),
});

module.exports = createTemoignageSchema;
