const { isEmpty } = require("lodash");

const sanitize = (value) => {
  let res = value.replace(/[ .,]/g, "").replace(/[^\x00-\xA0]/g, "");
  return isEmpty(res) ? null : res;
};

module.exports = (data) => {
  return {
    prenom: data.prenom_apprenti,
    nom: data.nom_apprenti,
    email: data.email_apprenti.replace(/ /g, ""),
    telephones: {
      fixe: sanitize(data.telephone_apprenti),
      portable: sanitize(data.portable_apprenti),
    },
  };
};
