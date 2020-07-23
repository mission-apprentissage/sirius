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
    send: async (type, contrat) => {
      let token = uuid.v4();

      await mailer.sendEmail(
        contrat.apprenti.email,
        `Que pensez-vous de votre formation ${contrat.formation.intitule} ?`,
        getEmail(type),
        { contrat, token }
      );

      await db.collection("contrats").updateOne(
        { _id: contrat._id },
        {
          $push: {
            questionnaires: {
              type,
              sentDate: new Date(),
              token,
              status: "sent",
              reponses: [],
            },
          },
        }
      );
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
