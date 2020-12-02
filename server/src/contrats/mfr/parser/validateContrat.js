const Joi = require("@hapi/joi");

let schema = Joi.object({
  formation: {
    codeDiplome: Joi.string().pattern(/^[0-9A-Z]{8}$/),
    intitule: Joi.string().required(),
    anneePromotion: Joi.string().allow(null),
    periode: Joi.object({
      debut: Joi.date().required(),
      fin: Joi.date().required(),
    }).required(),
  },
  cfa: {
    nom: Joi.string().allow(null),
    siret: Joi.string().pattern(/^[0-9]{9,14}$/),
    uaiResponsable: Joi.string()
      .pattern(/^[0-9]{7}[A-Z]$/)
      .allow(null),
    uaiFormateur: Joi.string()
      .pattern(/^[0-9]{7}[A-Z]$/)
      .allow(null),
    adresse: Joi.string().required(),
    codePostal: Joi.string().required(),
  },
  rupture: Joi.date().allow(null),
  entreprise: {
    raisonSociale: Joi.string().allow(null),
    siret: Joi.string().pattern(/^[0-9]{9,14}$/),
    email: Joi.string().email().required(),
    tuteur: Joi.object({
      prenom: Joi.string(),
      nom: Joi.string(),
    }).allow(null),
  },
});

module.exports = (contrat) => schema.validate(contrat, { abortEarly: false });
