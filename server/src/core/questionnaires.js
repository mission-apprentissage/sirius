const Boom = require("boom");
const uuid = require("uuid");

module.exports = (db, mailer) => {
  const getQuestionnaire = async (token) => {
    let apprenti = await db.collection("apprentis").findOne({ "questionnaires.token": token });
    if (!apprenti) {
      throw Boom.badRequest("Le lien n'est pas valide");
    }

    let questionnaire = apprenti.questionnaires.find((q) => q.token === token);
    return {
      ...questionnaire,
      meta: {
        apprenti: {
          prenom: apprenti.prenom,
          nom: apprenti.nom,
          formation: apprenti.formation,
        },
      },
    };
  };

  return {
    getQuestionnaire,
    send: async (apprenti, type) => {
      let token = uuid.v4();

      await mailer.sendEmail(
        apprenti.email,
        `Que pensez-vous de votre formation ${apprenti.formation.intitule}`,
        type,
        { apprenti, token }
      );

      return db.collection("apprentis").updateOne(
        { _id: apprenti._id },
        {
          $push: {
            questionnaires: {
              type,
              token,
              status: "sent",
              reponses: [],
            },
          },
        }
      );
    },
    open: async (token) => {
      let questionnaire = await getQuestionnaire(token);
      if (questionnaire.status === "closed") {
        throw Boom.badRequest("Le questionnaire n'est plus disponible");
      }

      let { value: apprenti } = await db.collection("apprentis").findOneAndUpdate(
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

      if (!apprenti) {
        throw Boom.badRequest("Questionnaire inconnu");
      }

      return {
        prenom: apprenti.prenom,
        nom: apprenti.nom,
        formation: apprenti.formation,
      };
    },
    addReponse: async (token, reponse) => {
      let questionnaire = await getQuestionnaire(token);
      if (questionnaire.status === "closed") {
        throw Boom.badRequest("Le questionnaire n'est plus disponible");
      }

      let reponses = [...questionnaire.reponses.filter((r) => r.id !== reponse.id), reponse];

      let { value } = await db.collection("apprentis").findOneAndUpdate(
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

      if (!value) {
        throw Boom.badRequest("Questionnaire inconnu");
      }
    },
    close: async (token) => {
      let { value } = await db.collection("apprentis").findOneAndUpdate(
        { "questionnaires.token": token },
        {
          $set: {
            "questionnaires.$.updateDate": new Date(),
            "questionnaires.$.status": "closed",
          },
        },
        { returnOriginal: false }
      );

      if (!value) {
        throw Boom.badRequest("Questionnaire inconnu");
      }
    },
  };
};
