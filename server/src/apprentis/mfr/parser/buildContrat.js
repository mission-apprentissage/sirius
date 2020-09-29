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
  let codeDiplome = sanitize(data.code_diplome);
  let siretCfa = sanitize(data.siret);
  let siretEntreprise = sanitize(data.siret_entreprise);

  return {
    questionnaires: [],
    formation: {
      codeDiplome,
      intitule: data.app_diplome,
      anneePromotion: data.annee_promotion || null,
      periode: {
        debut: parseDate(data.date_debut),
        fin: parseDate(data.date_fin),
      },
    },
    cfa: {
      nom: data["etablissement/site_cfa"],
      siret: siretCfa,
      uaiResponsable: sanitize(data.code_uai_cfa),
      uaiFormateur: sanitize(data.code_uai_site),
      adresse: data.adresse_postale_cfa,
      codePostal: getCodePostal(data.adresse_postale_cfa),
    },
    rupture: data.date_rupture ? parseDate(data.date_rupture) : null,
    entreprise: {
      raisonSociale: isEmpty ? null : data.entreprise,
      siret: siretEntreprise,
      tuteur:
        data.prenom_tuteur && data.nom_tuteur
          ? {
              prenom: data.prenom_tuteur,
              nom: data.nom_tuteur,
            }
          : null,
    },
  };
};
