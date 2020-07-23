const Joi = require("@hapi/joi");

let schema = Joi.object({
  apprenti: {
    prenom: Joi.string().required(),
    nom: Joi.string().required(),
    email: Joi.string().required(),
    creationDate: Joi.date().required(),
    telephones: {
      fixe: Joi.string().allow(null),
      portable: Joi.string().allow(null),
    },
  },
  formation: {
    code_diplome: Joi.string().required(),
    intitule: Joi.string().required(),
    annee_promotion: Joi.string().allow(null),
    periode: Joi.object({
      debut: Joi.date(),
      fin: Joi.date(),
    }).allow(null),
  },
  cfa: {
    uai_responsable: Joi.string()
      .pattern(/^[0-9]{7}[A-Z]$/)
      .allow(null),
    uai_formateur: Joi.string()
      .pattern(/^[0-9]{7}[A-Z]$/)
      .allow(null),
    adresse: Joi.string().required(),
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
