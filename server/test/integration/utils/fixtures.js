const _ = require("lodash");

module.exports = {
  newApprenti: (custom = {}) => {
    return _.merge(
      {
        prenom: "Marie",
        nom: "Louise",
        email: "ml@apprentissage.fr",
        formation: {
          intitule: "CAP Boucher à Institut régional de formation des métiers de l'artisanat",
        },
        creationDate: new Date(),
        questionnaires: [],
      },
      custom
    );
  },
};
