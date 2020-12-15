const moment = require("moment");
const { isEmpty } = require("lodash");
const sanitize = require("./sanitize");
const parseDate = (value) => new Date(moment(value, "DD/MM/YYYY").format("YYYY-MM-DD") + "Z");

const sanitizeCode = (value) => {
  let res = sanitize(value);
  return isEmpty(res) ? null : res.replace(/[ .,]/g, "");
};

const getCodePostal = (adresse) => {
  let matched = adresse.replace(/ /g, "").match(/([0-9]{5})|([0-9]{2} [0-9]{3})/);
  return matched && matched.length > 0 ? matched[0].replace(/ /g, "") : null;
};

module.exports = (data) => {
  return {
    formation: {
      codeDiplome: sanitizeCode(data.code_diplome),
      intitule: sanitize(data.app_diplome),
      anneePromotion: data.annee_promotion || null,
      periode: {
        debut: parseDate(data.date_debut),
        fin: parseDate(data.date_fin),
      },
    },
    cfa: {
      nom: data["etablissement/site_cfa"],
      siret: sanitizeCode(data.siret),
      uaiResponsable: sanitizeCode(data.code_uai_cfa),
      uaiFormateur: sanitizeCode(data.code_uai_site),
      adresse: data.adresse_postale_cfa,
      codePostal: getCodePostal(data.adresse_postale_cfa),
    },
    rupture: data.date_rupture ? parseDate(data.date_rupture) : null,
    entreprise: {
      raisonSociale: sanitize(data.entreprise),
      siret: sanitizeCode(data.siret_entreprise),
      email: data.email_entreprise ? data.email_entreprise.replace(/ /g, "") : null,
      tuteur:
        data.prenom_tuteur && data.nom_tuteur
          ? {
              prenom: sanitize(data.prenom_tuteur),
              nom: sanitize(data.nom_tuteur),
            }
          : null,
    },
  };
};
