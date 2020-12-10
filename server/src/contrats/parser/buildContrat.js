const moment = require("moment");
const { isEmpty } = require("lodash");
const parseDate = (value) => new Date(moment(value, "DD/MM/YYYY").format("YYYY-MM-DD") + "Z");

const sanitizeDiacritics = (value) => {
  let res = value
    .replace(/´/g, "")
    .replace(/ª/g, "")
    .replace(/È/g, "é")
    .replace(/Ë/g, "è")
    .replace(/Ù/g, "ô")
    .replace(/…/g, "É")
    .replace(/Î/g, "ë")
    .replace(/Ó/g, "î")
    .replace(/ª´/g, "")
    .replace(/b‚t/g, "bât")
    .replace(/l\?/g, "l'")
    .replace(/ \? /g, " ");
  return isEmpty(res) ? null : res;
};

const sanitize = (value) => {
  let res = sanitizeDiacritics(value);
  return isEmpty(res) ? null : res.replace(/[ .,]/g, "");
};

const getCodePostal = (adresse) => {
  let matched = adresse.replace(/ /g, "").match(/([0-9]{5})|([0-9]{2} [0-9]{3})/);
  return matched && matched.length > 0 ? matched[0].replace(/ /g, "") : null;
};

module.exports = (data) => {
  return {
    formation: {
      codeDiplome: sanitize(data.code_diplome),
      intitule: sanitizeDiacritics(data.app_diplome),
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
      raisonSociale: sanitizeDiacritics(data.entreprise),
      siret: sanitize(data.siret_entreprise),
      email: data.email_entreprise.replace(/ /g, ""),
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
