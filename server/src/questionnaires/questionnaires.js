const Boom = require("boom");
const path = require("path");

module.exports = (db, mailer) => {
  const statuses = { sent: 0, error: 1, opened: 2, clicked: 3, inprogress: 4, closed: 5 };
  const getEmailTemplate = (type) => path.join(__dirname, "emails", `${type}.mjml.ejs`);
  const getData = async (token) => {
    let apprenti = await db.collection("apprentis").findOne({ "contrats.questionnaires.token": token });
    if (!apprenti) {
      throw Boom.badRequest("Questionnaire inconnu");
    }

    let contrat = apprenti.contrats.find((c) => !!c.questionnaires.find((q) => q.token === token));
    let questionnaire = contrat.questionnaires.find((q) => q.token === token);
    return { apprenti, contrat, questionnaire };
  };

  const sendEmail = async (apprenti, contrat, questionnaire) => {
    let { token, type } = questionnaire;

    try {
      let titre = `Que pensez-vous de votre formation ${contrat.formation.intitule} ?`;
      await mailer.sendEmail(apprenti.email, titre, getEmailTemplate(type), { apprenti, contrat, token });
    } catch (e) {
      await db.collection("apprentis").updateOne(
        { "contrats.questionnaires.token": token },
        {
          $set: {
            "contrats.$[c].questionnaires.$[q].status": "error",
            "contrats.$[c].questionnaires.$[q].sendDate": new Date(),
          },
        },
        {
          arrayFilters: [
            {
              "c.questionnaires.token": token,
            },
            {
              "q.token": token,
            },
          ],
        }
      );
      throw e;
    }
  };

  return {
    sendQuestionnaire: async (token) => {
      let { apprenti, contrat, questionnaire } = await getData(token);

      if (questionnaire.status === "closed") {
        throw Boom.badRequest("Impossible d'envoyer le questionnaire car il est fermé");
      }

      await sendEmail(apprenti, contrat, questionnaire);

      let { value: result } = await db.collection("apprentis").findOneAndUpdate(
        { "contrats.questionnaires.token": token },
        {
          $set: {
            "contrats.$[c].questionnaires.$[q].status": questionnaire.status || "sent",
            "contrats.$[c].questionnaires.$[q].sendDate": new Date(),
          },
          $inc: {
            "contrats.$[c].questionnaires.$[q].nbEmailsSent": 1,
          },
        },
        {
          returnOriginal: false,
          arrayFilters: [
            {
              "c.questionnaires.token": token,
            },
            {
              "q.token": token,
            },
          ],
        }
      );

      if (!result) {
        throw Boom.badRequest("Questionnaire inconnu");
      }
    },
    previewEmail: async (token) => {
      let { apprenti, contrat, questionnaire } = await getData(token);

      return mailer.renderEmail(getEmailTemplate(questionnaire.type), {
        apprenti,
        token,
        contrat,
      });
    },
    markAsOpened: async (token) => {
      let { questionnaire } = await getData(token);
      let currentStatus = statuses[questionnaire.status];

      if (currentStatus > statuses["opened"]) {
        throw Boom.badRequest(
          `Impossible de changer le status du questionnaire en ouvert car il est '${questionnaire.status}'`
        );
      }

      await db.collection("apprentis").updateOne(
        { "contrats.questionnaires.token": token },
        {
          $set: {
            "contrats.$[c].questionnaires.$[q].status": "opened",
          },
        },
        {
          arrayFilters: [
            {
              "c.questionnaires.token": token,
            },
            {
              "q.token": token,
            },
          ],
        }
      );
    },
    markAsClicked: async (token) => {
      let { apprenti, contrat, questionnaire } = await getData(token);
      let currentStatus = statuses[questionnaire.status];

      if (currentStatus > statuses["clicked"]) {
        throw Boom.badRequest(
          `Impossible de changer le status du questionnaire en cliqué car il est '${questionnaire.status}'`
        );
      }

      let { value: result } = await db.collection("apprentis").findOneAndUpdate(
        { "contrats.questionnaires.token": token },
        {
          $set: {
            "contrats.$[c].questionnaires.$[q].status": "clicked",
            "contrats.$[c].questionnaires.$[q].updateDate": new Date(),
            "contrats.$[c].questionnaires.$[q].questions": [],
          },
        },
        {
          returnOriginal: false,
          arrayFilters: [
            {
              "c.questionnaires.token": token,
            },
            {
              "q.token": token,
            },
          ],
        }
      );

      if (!result) {
        throw Boom.badRequest("Questionnaire inconnu");
      }

      return {
        type: questionnaire.type,
        formation: {
          intitule: contrat.formation.intitule,
        },
        apprenti: {
          prenom: apprenti.prenom,
          nom: apprenti.nom,
          formation: apprenti.formation,
        },
      };
    },
    answerToQuestion: async (token, questionId, reponses) => {
      let { questionnaire } = await getData(token);
      let currentStatus = statuses[questionnaire.status];

      if (currentStatus > statuses["inprogress"]) {
        throw Boom.badRequest(
          `Impossible de changer le status du questionnaire en cours car il est '${questionnaire.status}'`
        );
      }

      let { value: result } = await db.collection("apprentis").findOneAndUpdate(
        { "contrats.questionnaires.token": token },
        {
          $set: {
            "contrats.$[c].questionnaires.$[q].status": "inprogress",
            "contrats.$[c].questionnaires.$[q].updateDate": new Date(),
            "contrats.$[c].questionnaires.$[q].questions": [
              ...questionnaire.questions.filter((q) => q.id !== questionId),
              {
                id: questionId,
                reponses,
              },
            ],
          },
        },
        {
          returnOriginal: false,
          arrayFilters: [
            {
              "c.questionnaires.token": token,
            },
            {
              "q.token": token,
            },
          ],
        }
      );

      if (!result) {
        throw Boom.badRequest("Questionnaire inconnu");
      }
    },
    close: async (token) => {
      let { value: result } = await db.collection("apprentis").findOneAndUpdate(
        { "contrats.questionnaires.token": token },
        {
          $set: {
            "contrats.$[c].questionnaires.$[q].status": "closed",
            "contrats.$[c].questionnaires.$[q].updateDate": new Date(),
          },
        },
        {
          returnOriginal: false,
          arrayFilters: [
            {
              "c.questionnaires.token": token,
            },
            {
              "q.token": token,
            },
          ],
        }
      );

      if (!result) {
        throw Boom.badRequest("Questionnaire inconnu");
      }
    },
  };
};
