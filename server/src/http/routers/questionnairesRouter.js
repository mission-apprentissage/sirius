const express = require("express");
const tryCatch = require("../middlewares/tryCatchMiddleware");
const Joi = require("@hapi/joi");
const Boom = require("boom");

module.exports = ({ db }) => {
  const router = express.Router(); // eslint-disable-line new-cap
  const serializeQuestionnaire = (questionnaire, apprenti) => {
    return {
      type: questionnaire.type,
      meta: {
        apprenti: {
          prenom: apprenti.prenom,
          nom: apprenti.nom,
          formation: apprenti.formation,
        },
      },
    };
  };
  const validateToken = tryCatch(async (req, res, next) => {
    let { token } = req.params;

    let apprenti = await db.collection("apprentis").findOne({ "questionnaires.token": token });
    if (!apprenti) {
      throw Boom.badRequest("Le lien n'est pas valide");
    }

    let questionnaire = apprenti.questionnaires.find((q) => q.token === token);
    if (questionnaire.status === "closed") {
      throw Boom.badRequest("Le questionnaire n'est plus disponible");
    }

    req.token = token;
    req.apprenti = apprenti;
    req.questionnaire = questionnaire;
    next();
  });

  router.get(
    "/api/questionnaires/:token",
    validateToken,
    tryCatch(async (req, res) => {
      let { apprenti, questionnaire } = req;

      res.json(serializeQuestionnaire(questionnaire, apprenti));
    })
  );

  router.put(
    "/api/questionnaires/:token/reponse",
    validateToken,
    tryCatch(async (req, res) => {
      let { questionnaire, token } = req;
      let reponse = await Joi.object({
        id: Joi.string().required(),
        data: Joi.any().required(),
      }).validateAsync(req.body, { abortEarly: false });

      let { value: newApprenti } = await db.collection("apprentis").findOneAndUpdate(
        { "questionnaires.token": token },
        {
          $set: {
            "questionnaires.$.updateDate": new Date(),
            "questionnaires.$.status": "inprogress",
            "questionnaires.$.reponses": [...questionnaire.reponses.filter((r) => r.id !== reponse.id), reponse],
          },
        },
        { returnOriginal: false }
      );

      if (!newApprenti) {
        throw Boom.badRequest("Questionnaire inconnu");
      }

      res.json(serializeQuestionnaire(req.questionnaire, newApprenti));
    })
  );

  router.put(
    "/api/questionnaires/:token/close",
    validateToken,
    tryCatch(async (req, res) => {
      let { token } = req;
      await Joi.object({}).validateAsync(req.body, { abortEarly: false });

      let { value: newApprenti } = await db.collection("apprentis").findOneAndUpdate(
        { "questionnaires.token": token },
        {
          $set: {
            "questionnaires.$.updateDate": new Date(),
            "questionnaires.$.status": "closed",
          },
        },
        { returnOriginal: false }
      );

      if (!newApprenti) {
        throw Boom.badRequest("Questionnaire inconnu");
      }

      res.json(serializeQuestionnaire(req.questionnaire, newApprenti));
    })
  );

  return router;
};
