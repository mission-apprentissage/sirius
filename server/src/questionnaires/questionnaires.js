const Boom = require("boom");
const uuid = require("uuid");
const path = require("path");

module.exports = (db, mailer, contrats) => {
  const getEmail = (type) => path.join(__dirname, "emails", `${type}.mjml.ejs`);

  return {
    previewEmail: async (token) => {
      let contrat = await contrats.getContratByToken(token);
      let questionnaire = contrat.questionnaires.find((q) => q.token === token);

      return mailer.renderEmail(getEmail(questionnaire.type), {
        token,
        contrat,
      });
    },
    create: async (type, contrat) => {
      let token = uuid.v4();

      if (contrat.questionnaires[type]) {
        throw Boom.badRequest(`Le contrat possède déjà un questionnaire du type ${type}`);
      }

      await db.collection("contrats").updateOne(
        { _id: contrat._id },
        {
          $push: {
            questionnaires: {
              type,
              token,
              nbEmailsSent: 0,
              reponses: [],
            },
          },
        }
      );

      return token;
    },
    send: async (token) => {
      let contrat = await contrats.getContratByToken(token);
      let questionnaire = contrat.questionnaires.find((q) => q.token === token);

      await mailer.sendEmail(
        contrat.apprenti.email,
        `Que pensez-vous de votre formation ${contrat.formation.intitule} ?`,
        getEmail(questionnaire.type),
        { contrat, token }
      );

      let { value: newContrat } = await db.collection("contrats").findOneAndUpdate(
        { "questionnaires.token": token },
        {
          $set: {
            "questionnaires.$.status": questionnaire.status || "sent",
            "questionnaires.$.sentDate": new Date(),
          },
          $inc: {
            "questionnaires.$.nbEmailsSent": 1,
          },
        },
        { returnOriginal: false }
      );

      if (!newContrat) {
        throw Boom.badRequest("Questionnaire inconnu");
      }
    },
    open: async (token) => {
      let contrat = await contrats.getContratByToken(token);
      let questionnaire = contrat.questionnaires.find((q) => q.token === token);

      if (questionnaire.status === "closed") {
        throw Boom.badRequest("Le questionnaire n'est plus disponible");
      }

      let { value: newContrat } = await db.collection("contrats").findOneAndUpdate(
        { "questionnaires.token": token },
        {
          $set: {
            "questionnaires.$.updateDate": new Date(),
            "questionnaires.$.status": "opened",
            "questionnaires.$.reponses": [],
          },
        },
        { returnOriginal: false }
      );

      if (!newContrat) {
        throw Boom.badRequest("Questionnaire inconnu");
      }

      return {
        formation: {
          intitule: contrat.formation.intitule,
        },
        apprenti: {
          prenom: contrat.apprenti.prenom,
          nom: contrat.apprenti.nom,
          formation: contrat.apprenti.formation,
        },
      };
    },
    addReponse: async (token, reponse) => {
      let contrat = await contrats.getContratByToken(token);
      let questionnaire = contrat.questionnaires.find((q) => q.token === token);
      let reponses = [...questionnaire.reponses.filter((r) => r.id !== reponse.id), reponse];

      if (questionnaire.status === "closed") {
        throw Boom.badRequest("Le questionnaire n'est plus disponible");
      }

      let { value: newContrat } = await db.collection("contrats").findOneAndUpdate(
        { "questionnaires.token": token },
        {
          $set: {
            "questionnaires.$.updateDate": new Date(),
            "questionnaires.$.status": "inprogress",
            "questionnaires.$.reponses": reponses,
          },
        },
        { returnOriginal: false }
      );

      if (!newContrat) {
        throw Boom.badRequest("Questionnaire inconnu");
      }
    },
    close: async (token) => {
      let { value: newContrat } = await db.collection("contrats").findOneAndUpdate(
        { "questionnaires.token": token },
        {
          $set: {
            "questionnaires.$.updateDate": new Date(),
            "questionnaires.$.status": "closed",
          },
        },
        { returnOriginal: false }
      );

      if (!newContrat) {
        throw Boom.badRequest("Questionnaire inconnu");
      }
    },
  };
};
