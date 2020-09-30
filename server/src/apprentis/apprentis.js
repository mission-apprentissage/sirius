const uuid = require("uuid");
const { sortBy } = require("lodash");
const moment = require("moment");

module.exports = (db) => {
  return {
    exists: async (email) => {
      let count = await db.collection("apprentis").countDocuments({ email });
      return count > 0;
    },
    create: (data) => {
      return db.collection("apprentis").insertOne(data);
    },
    unsubscribe: (id) => {
      return db.collection("contrats").updateOne({ _id: id }, { $set: { unsubscribe: true } });
    },
    hasContrat: async (email, contrat) => {
      let count = await db.collection("apprentis").countDocuments({
        email,
        "contrats.formation.codeDiplome": contrat.formation.codeDiplome,
        "contrats.cfa.siret": contrat.cfa.siret,
        "contrats.entreprise.siret": contrat.entreprise.siret,
      });
      return count > 0;
    },
    addContrat: (email, contrat) => {
      return db.collection("apprentis").updateOne(
        { email },
        {
          $push: {
            contrats: contrat,
          },
        }
      );
    },
    getNextQuestionnaireContext: async (email) => {
      let apprenti = await db.collection("apprentis").findOne({ email });
      let contrat = sortBy(apprenti.contrats, ["formation.periode.fin"]).pop();
      let periode = contrat.formation.periode;

      if (!periode) {
        //FIXME
        return null;
      }

      let type = null;
      let isFormationTerminée = moment(periode.fin).isBefore(moment());
      let isPremièreAnnéeTerminée = moment(periode.debut).add(1, "years").isBefore(moment());

      if (isFormationTerminée) {
        if (!contrat.questionnaires.find((q) => q.type === "finFormation")) {
          type = "finFormation";
        }
      } else if (isPremièreAnnéeTerminée) {
        if (contrat.questionnaires.length === 0 && moment(periode.fin).diff(moment(), "months") > 12) {
          type = "finAnnee";
        }
      }

      return type ? { contrat, type } : null;
    },
    generateQuestionnaire: async (email, context) => {
      let { contrat, type } = context;
      let questionnaire = {
        type,
        token: uuid.v4(),
        nbEmailsSent: 0,
        questions: [],
      };

      await db.collection("apprentis").updateOne(
        {
          email,
        },
        {
          $push: {
            "contrats.$[c].questionnaires": questionnaire,
          },
        },
        {
          arrayFilters: [
            {
              "c.formation.codeDiplome": contrat.formation.codeDiplome,
              "c.cfa.siret": contrat.cfa.siret,
              "c.entreprise.siret": contrat.entreprise.siret,
            },
          ],
        }
      );

      return questionnaire;
    },
  };
};
