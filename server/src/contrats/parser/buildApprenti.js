const sanitize = require("./sanitize");

module.exports = (data) => {
  return {
    prenom: sanitize(data.prenom_apprenti),
    nom: sanitize(data.nom_apprenti),
    email: data.email_apprenti.replace(/ /g, ""),
    telephones: {
      fixe: sanitize(data.telephone_apprenti),
      portable: sanitize(data.portable_apprenti),
    },
  };
};
