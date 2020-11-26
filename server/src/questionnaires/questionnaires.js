const uuid = require("uuid");
const Boom = require("boom");
const path = require("path");

module.exports = (db, mailer) => {
  const statuses = { created: 0, sent: 1, error: 2, opened: 3, clicked: 4, pending: 5, inprogress: 6, closed: 7 };
  const getEmailTemplate = (type) => path.join(__dirname, "emails", `${type}.mjml.ejs`);
  const getQuestionnaireDetails = async (token) => {
    let apprenti = await db.collection("apprentis").findOne({ "contrats.questionnaires.token": token });
    if (!apprenti) {
      throw Boom.notFound("Questionnaire inconnu");
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
            "contrats.$[].questionnaires.$[q].status": "error",
          },
          $push: {
            "contrats.$[].questionnaires.$[q].sendDates": new Date(),
          },
        },
        {
          arrayFilters: [
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
    getQuestionnaireDetails,
    buildQuestionnaire: (contrat, type) => {
      return {
        type,
        token: uuid.v4(),
        status: "created",
        sendDates: [],
        questions: [],
      };
    },
    sendQuestionnaire: async (token) => {
      let { apprenti, contrat, questionnaire } = await getQuestionnaireDetails(token);

      if (questionnaire.status === "closed") {
        throw Boom.badRequest("Impossible d'envoyer le questionnaire car il est fermé");
      }

      await sendEmail(apprenti, contrat, questionnaire);

      let { value: updated } = await db.collection("apprentis").findOneAndUpdate(
        { "contrats.questionnaires.token": token },
        {
          $set: {
            "contrats.$[].questionnaires.$[q].status":
              questionnaire.status === "created" ? "sent" : questionnaire.status,
          },
          $push: {
            "contrats.$[].questionnaires.$[q].sendDates": new Date(),
          },
        },
        {
          arrayFilters: [
            {
              "q.token": token,
            },
          ],
        }
      );

      if (!updated) {
        throw Boom.badRequest("Questionnaire inconnu");
      }
    },
    previewEmail: async (token) => {
      let { apprenti, contrat, questionnaire } = await getQuestionnaireDetails(token);

      return mailer.renderEmail(getEmailTemplate(questionnaire.type), {
        apprenti,
        token,
        contrat,
      });
    },
    markAsOpened: async (token) => {
      let { questionnaire } = await getQuestionnaireDetails(token);

      if (statuses[questionnaire.status] < statuses["opened"]) {
        await db.collection("apprentis").updateOne(
          { "contrats.questionnaires.token": token },
          {
            $set: {
              "contrats.$[].questionnaires.$[q].status": "opened",
              "contrats.$[].questionnaires.$[q].updateDate": new Date(),
            },
          },
          {
            arrayFilters: [
              {
                "q.token": token,
              },
            ],
          }
        );
      }
    },
    markAsClicked: async (token) => {
      let { questionnaire } = await getQuestionnaireDetails(token);

      if (statuses[questionnaire.status] <= statuses["inprogress"]) {
        await db.collection("apprentis").updateOne(
          { "contrats.questionnaires.token": token },
          {
            $set: {
              "contrats.$[].questionnaires.$[q].status": "clicked",
              "contrats.$[].questionnaires.$[q].updateDate": new Date(),
              "contrats.$[].questionnaires.$[q].questions": [],
            },
          },
          {
            arrayFilters: [
              {
                "q.token": token,
              },
            ],
          }
        );
      }
    },
    answerToQuestion: async (token, questionId, reponses, options = {}) => {
      let { questionnaire } = await getQuestionnaireDetails(token);

      if (questionnaire.status === "closed") {
        throw Boom.badRequest(`Impossible de répondre au questionnaire`);
      }

      await db.collection("apprentis").updateOne(
        { "contrats.questionnaires.token": token },
        {
          $set: {
            "contrats.$[].questionnaires.$[q].status": "inprogress",
            "contrats.$[].questionnaires.$[q].updateDate": new Date(),
            "contrats.$[].questionnaires.$[q].questions": [
              ...questionnaire.questions.filter((q) => q.id !== questionId),
              {
                id: questionId,
                ...(options.thematique ? { thematique: options.thematique } : {}),
                reponses,
              },
            ],
          },
        },
        {
          arrayFilters: [
            {
              "q.token": token,
            },
          ],
        }
      );
    },
    markAsPending: async (token) => {
      let { questionnaire } = await getQuestionnaireDetails(token);

      if (questionnaire.status === "closed") {
        throw Boom.badRequest(`Impossible de mettre le questionnaire en pending`);
      }

      await db.collection("apprentis").updateOne(
        { "contrats.questionnaires.token": token },
        {
          $set: {
            "contrats.$[].questionnaires.$[q].status": "pending",
            "contrats.$[].questionnaires.$[q].updateDate": new Date(),
          },
        },
        {
          arrayFilters: [
            {
              "q.token": token,
            },
          ],
        }
      );
    },
    close: async (token) => {
      let { questionnaire } = await getQuestionnaireDetails(token);

      if (questionnaire.status === "closed") {
        throw Boom.badRequest(`Impossible de fermer le questionnaire`);
      }

      await db.collection("apprentis").updateOne(
        { "contrats.questionnaires.token": token },
        {
          $set: {
            "contrats.$[].questionnaires.$[q].status": "closed",
            "contrats.$[].questionnaires.$[q].updateDate": new Date(),
          },
        },
        {
          arrayFilters: [
            {
              "q.token": token,
            },
          ],
        }
      );
    },
  };
};
