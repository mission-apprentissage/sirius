const Boom = require("boom");

module.exports = (db) => {
  return {
    getContratByToken: async (token) => {
      let contrat = await db.collection("contrats").findOne({ "questionnaires.token": token });
      if (!contrat) {
        throw Boom.badRequest("Le lien n'est pas valide");
      }

      return contrat;
    },
    unsubscribe: (id) => {
      return db.collection("contrats").updateOne({ _id: id }, { $set: { unsubscribe: true } });
    },
  };
};
