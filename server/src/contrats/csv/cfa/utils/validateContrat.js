const Joi = require("@hapi/joi");

let schema = Joi.object({
  creationDate: Joi.date().required(),
  cohorte: Joi.string().required(),
  apprenti: {
    prenom: Joi.string().required(),
    nom: Joi.string().required(),
    email: Joi.string().required(),
    telephones: {
      fixe: Joi.string().allow(null),
      portable: Joi.string().allow(null),
    },
  },
  formation: {
    codeDiplome: Joi.string()
      .pattern(/^[0-9A-Z]{8}$/)
      .allow(null),
    intitule: Joi.string().required(),
    anneePromotion: Joi.string().allow(null),
    periode: Joi.object({
      debut: Joi.date(),
      fin: Joi.date(),
    }).allow(null),
  },
  cfa: {
    nom: Joi.string().allow(null),
    siret: Joi.string()
      .pattern(/^[0-9]{9,14}$/)
      .allow(null),
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
    siret: Joi.string()
      .pattern(/^[0-9]{9,14}$/)
      .allow(null),
    tuteur: Joi.object({
      prenom: Joi.string(),
      nom: Joi.string(),
    }).allow(null),
  },
  questionnaires: Joi.array().required(),
  unsubscribe: Joi.boolean().required(),
});

module.exports = (contrat) => {
  return schema.validateAsync(contrat, { abortEarly: false });
};
