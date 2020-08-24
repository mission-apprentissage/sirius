const moment = require("moment");
const { isEmpty } = require("lodash");

const parseDate = (value) => new Date(moment(value, "DD-MM-YYYY").format("YYYY-MM-DD") + "Z");

const sanitize = (value) => {
  let res = value.replace(/[ .,]/g, "").replace(/[^\x00-\xA0]/g, "");
  return isEmpty(res) ? null : res;
};

module.exports = (data) => {
  return {
    creationDate: new Date(),
    cohorte: `cohorte_test_q2_${moment().format("YYYY_MM_DD")}`,
    apprenti: {
      prenom: data.prenom_apprenti,
      nom: data.nom_apprenti,
      email: data.email_apprenti,
      telephones: {
        fixe: sanitize(data.telephone_apprenti),
        portable: sanitize(data.portable_apprenti),
      },
    },
    formation: {
      code_diplome: sanitize(data.code_diplome),
      intitule: data.app_diplome,
      annee_promotion: data.annee_promotion || null,
      periode:
        data.date_debut && data.date_fin
          ? {
              debut: data.date_debut ? parseDate(data.date_debut) : null,
              fin: data.date_fin ? parseDate(data.date_fin) : null,
            }
          : null,
    },
    cfa: {
      uai_responsable: sanitize(data.code_uai_cfa),
      uai_formateur: sanitize(data.code_uai_site),
      adresse: data.adresse_postale_cfa,
    },
    rupture: data.date_rupture ? parseDate(data.date_rupture) : null,
    entreprise: {
      raisonSociale: isEmpty ? null : data.entreprise,
      siret: sanitize(data.siret_entreprise),
      tuteur:
        data.prenom_tuteur && data.nom_tuteur
          ? {
              prenom: data.prenom_tuteur,
              nom: data.nom_tuteur,
            }
          : null,
    },
    questionnaires: [],
    unsubscribe: false,
  };
};
