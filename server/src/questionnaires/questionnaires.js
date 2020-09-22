const Boom = require("boom");
const uuid = require("uuid");
const path = require("path");
const moment = require("moment");

const getEmail = (type) => path.join(__dirname, "emails", `${type}.mjml.ejs`);
const findNext = (contrat) => {
  let periode = contrat.formation.periode;

  if (!periode) {
    //FIXME
    return null;
  }

  if (moment(periode.fin).isBefore(moment()) && !contrat.questionnaires.find((q) => q.type === "finFormation")) {
    return "finFormation";
  } else if (moment(periode.debut).add(1, "years").isBefore(moment()) && contrat.questionnaires.length === 0) {
    return "finAnnee";
  }

  return null;
};

module.exports = (db, mailer, contrats) => {
  return {
    findNext,
    create: async (contrat, type) => {
      let questionnaire = {
        type,
        token: uuid.v4(),
        nbEmailsSent: 0,
        questions: [],
      };

      await db.collection("contrats").updateOne(
        { _id: contrat._id },
        {
          $push: {
            questionnaires: questionnaire,
          },
        }
      );

      return questionnaire;
    },
    sendQuestionnaire: async (token) => {
      let contrat = await contrats.getContratByToken(token);
      let questionnaire = contrat.questionnaires.find((q) => q.token === token);

      if (questionnaire.status === "closed") {
        throw Boom.badRequest("Le questionnaire n'est plus disponible et ne peut donc pas être envoyé");
      }

      try {
        let titre = `Que pensez-vous de votre formation ${contrat.formation.intitule} ?`;
        await mailer.sendEmail(contrat.apprenti.email, titre, getEmail(questionnaire.type), { contrat, token });
      } catch (e) {
        await db.collection("contrats").updateOne(
          { "questionnaires.token": token },
          {
            $set: {
              "questionnaires.$.status": "error",
              "questionnaires.$.sentDate": new Date(),
            },
          }
        );
        throw e;
      }

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
    previewEmail: async (token) => {
      let contrat = await contrats.getContratByToken(token);
      let questionnaire = contrat.questionnaires.find((q) => q.token === token);

      return mailer.renderEmail(getEmail(questionnaire.type), {
        token,
        contrat,
      });
    },
    markAsOpened: async (token) => {
      await db.collection("contrats").updateOne(
        { "questionnaires.token": token },
        {
          $set: {
            "questionnaires.$.status": "opened",
          },
        }
      );
    },
    markAsClicked: async (token) => {
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
            "questionnaires.$.status": "clicked",
            "questionnaires.$.questions": [],
          },
        },
        { returnOriginal: false }
      );

      if (!newContrat) {
        throw Boom.badRequest("Questionnaire inconnu");
      }

      return {
        type: questionnaire.type,
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
    answerToQuestion: async (token, questionId, reponses) => {
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
            "questionnaires.$.status": "inprogress",
            "questionnaires.$.questions": [
              ...questionnaire.questions.filter((q) => q.id !== questionId),
              {
                id: questionId,
                reponses,
              },
            ],
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
