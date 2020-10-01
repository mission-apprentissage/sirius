const moment = require("moment");
const { isEmpty } = require("lodash");

const parseDate = (value) => new Date(moment(value, "DD/MM/YYYY").format("YYYY-MM-DD") + "Z");

const sanitize = (value) => {
  let res = value.replace(/[ .,]/g, "").replace(/[^\x00-\xA0]/g, "");
  return isEmpty(res) ? null : res;
};

const getCodePostal = (adresse) => {
  let matched = adresse.replace(/ /g, "").match(/([0-9]{5})|([0-9]{2} [0-9]{3})/);
  return matched && matched.length > 0 ? matched[0].replace(/ /g, "") : null;
};

module.exports = (data) => {
  return {
    creationDate: new Date(),
    cohorte: `cohorte_test_q2_${moment().format("YYYY_MM_DD")}`,
    apprenti: {
      prenom: data.prenom_apprenti,
      nom: data.nom_apprenti,
      email: data.email_apprenti.replace(/ /g, ""),
      telephones: {
        fixe: sanitize(data.telephone_apprenti),
        portable: sanitize(data.portable_apprenti),
      },
    },
    formation: {
      codeDiplome: sanitize(data.code_diplome),
      intitule: data.app_diplome,
      anneePromotion: data.annee_promotion || null,
      periode: {
        debut: parseDate(data.date_debut),
        fin: parseDate(data.date_fin),
      },
    },
    cfa: {
      nom: data["etablissement/site_cfa"],
      siret: sanitize(data.siret),
      uaiResponsable: sanitize(data.code_uai_cfa),
      uaiFormateur: sanitize(data.code_uai_site),
      adresse: data.adresse_postale_cfa,
      codePostal: getCodePostal(data.adresse_postale_cfa),
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
