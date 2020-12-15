module.exports = (db) => {
  return {
    getApprenti: (email) => {
      return db.collection("apprentis").findOne({ email });
    },
    exists: async (email) => {
      let count = await db.collection("apprentis").countDocuments({ email });
      return count > 0;
    },
    create: (data) => {
      return db.collection("apprentis").insertOne(data);
    },
    unsubscribe: (email) => {
      return db.collection("apprentis").updateOne({ email }, { $set: { unsubscribe: true } });
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
    addQuestionnaire: async (email, contrat, questionnaire) => {
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
    },
  };
};
