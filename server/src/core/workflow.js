const { sortBy, last } = require("lodash");
const moment = require("moment");

module.exports = (db) => {
  return {
    whatsNext: async (email) => {
      let apprenti = await db.collection("apprentis").findOne({ email });
      let contrat = last(sortBy(apprenti.contrats, ["formation.periode.fin"]));
      let periode = contrat.formation.periode;
      if (!periode) {
        //FIXME
        return null;
      }

      let isPremiereAnneeTerminee = moment(periode.debut).add(1, "years").isBefore(moment());
      let isFormationTerminee = moment(periode.fin).isBefore(moment());
      let allQuestionnaires = apprenti.contrats.reduce((acc, contrat) => [...acc, ...contrat.questionnaires], []);
      let notYetSent = (type) => !allQuestionnaires.find((q) => q.type === type);

      let type = null;
      if (isFormationTerminee) {
        if (notYetSent("finFormation") && !apprenti.unsubscribe) {
          type = "finFormation";
        }
      } else if (isPremiereAnneeTerminee) {
        if (
          allQuestionnaires.length === 0 &&
          moment(periode.fin).diff(moment(), "months") > 12 &&
          !apprenti.unsubscribe
        ) {
          type = "finAnnee";
        } else if (notYetSent("tuteur") && contrat.entreprise.email && !contrat.entreprise.unsubscribe) {
          type = "tuteur";
        }
      }

      return type ? { contrat, type } : null;
    },
  };
};
