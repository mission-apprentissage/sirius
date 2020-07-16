const _ = require("lodash");

module.exports = {
  newApprenti: (custom = {}) => {
    return _.merge(
      {
        prenom: "Marie",
        nom: "Louise",
        email: "ml@apprentissage.fr",
        token: "123456789",
        formation: {
          intitule: "CAP Boucher à Institut régional de formation des métiers de l'artisanat - IRFMA de l'Aude",
        },
      },
      custom
    );
  },
};
