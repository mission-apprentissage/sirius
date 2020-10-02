const Joi = require("@hapi/joi");

let schema = Joi.object({
  prenom: Joi.string().required(),
  nom: Joi.string().required(),
  email: Joi.string().required(),
  telephones: {
    fixe: Joi.string().allow(null),
    portable: Joi.string().allow(null),
  },
});

module.exports = (contrat) => schema.validate(contrat, { abortEarly: false });
