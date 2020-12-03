const uuid = require("uuid");
const emails = require("../questionnaires/emails/emails");
const { QuestionnaireNotFoundError, QuestionnaireNotAvailableError } = require("./errors");

module.exports = (db, mailer) => {
  const statuses = { created: 0, sent: 1, error: 2, opened: 3, clicked: 4, pending: 5, inprogress: 6, closed: 7 };

  const getQuestionnaireDetails = async (token) => {
    let apprenti = await db.collection("apprentis").findOne({ "contrats.questionnaires.token": token });
    if (!apprenti) {
      throw new QuestionnaireNotFoundError();
    }

    let contrat = apprenti.contrats.find((c) => !!c.questionnaires.find((q) => q.token === token));
    let questionnaire = contrat.questionnaires.find((q) => q.token === token);
    return { apprenti, contrat, questionnaire };
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
      let details = await getQuestionnaireDetails(token);
      let { type, status } = details.questionnaire;
      let { emailAddress, subject, template } = emails[type](details);

      if (status === "closed") {
        throw new QuestionnaireNotAvailableError();
      }

      try {
        await mailer.sendEmail(emailAddress, subject, template, details);
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

      let { value: updated } = await db.collection("apprentis").findOneAndUpdate(
        { "contrats.questionnaires.token": token },
        {
          $set: {
            "contrats.$[].questionnaires.$[q].status": status === "created" ? "sent" : status,
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
        throw new QuestionnaireNotFoundError();
      }
    },
    previewEmail: async (token) => {
      let details = await getQuestionnaireDetails(token);
      let { template } = emails[details.questionnaire.type](details);

      return mailer.renderEmail(template, details);
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
        throw new QuestionnaireNotAvailableError();
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
        throw new QuestionnaireNotAvailableError();
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
        throw new QuestionnaireNotAvailableError();
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
