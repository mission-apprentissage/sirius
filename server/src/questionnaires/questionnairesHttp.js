const express = require("express");
const { last } = require("lodash");
const moment = require("moment");
const Joi = require("@hapi/joi");
const sanitizeHtml = require("sanitize-html");
const { oleoduc, transformData } = require("oleoduc");
const tryCatch = require("../core/http/tryCatchMiddleware");
const { sendHTML, sendJsonStream, sendCSVStream } = require("../core/http/httpUtils");
const { QuestionnaireNotAvailableError } = require("../core/errors");
const authMiddleware = require("../core/http/authMiddleware");

module.exports = ({ db, config, questionnaires }) => {
  const router = express.Router(); // eslint-disable-line new-cap
  const checkAuth = authMiddleware(config);

  router.get(
    "/api/questionnaires/:token/previewEmail",
    tryCatch(async (req, res) => {
      let { token } = req.params;

      const html = await questionnaires.previewEmail(token);

      sendHTML(html, res);
    })
  );

  router.get(
    "/api/questionnaires/:token/markAsOpened",
    tryCatch(async (req, res) => {
      let { token } = req.params;
      await questionnaires.markAsOpened(token);

      res.writeHead(200, { "Content-Type": "image/gif" });
      res.end(Buffer.from("R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==", "base64"), "binary");
    })
  );

  router.get(
    "/api/questionnaires/:token/getExternalQuestionnaireUrl",
    tryCatch(async (req, res) => {
      let { token } = req.params;
      let { questionnaire } = await questionnaires.getQuestionnaireDetails(token);
      if (questionnaire.type === "tuteur") {
        await questionnaires.markAsClicked(token);
        return res.redirect("https://docs.google.com/forms/d/1j2OB40lWAn32lro2RNSUIwgAq3dw36_F4KGU_Ps9AeQ");
      }
      throw new QuestionnaireNotAvailableError();
    })
  );

  router.put(
    "/api/questionnaires/:token/markAsClicked",
    tryCatch(async (req, res) => {
      let { token } = req.params;

      await questionnaires.markAsClicked(token);
      let { apprenti, questionnaire } = await questionnaires.getQuestionnaireDetails(token);
      let isOlderThanOneMonth = moment(last(questionnaire.sendDates)).isBefore(moment().subtract(1, "months"));

      if (isOlderThanOneMonth) {
        throw new QuestionnaireNotAvailableError();
      } else {
        res.json({
          type: questionnaire.type,
          status: questionnaire.status,
          apprenti: {
            prenom: apprenti.prenom,
          },
        });
      }
    })
  );

  router.put(
    "/api/questionnaires/:token/answerToQuestion/:questionId",
    tryCatch(async (req, res) => {
      let { token, questionId } = req.params;
      let { thematique, reponses } = await Joi.object({
        thematique: Joi.string()
          .valid("cfaRelationEntreprise", "ambiance", "formateurs", "matériel", "preparationExamen")
          .allow(null),
        reponses: Joi.array()
          .items(
            Joi.object({
              id: Joi.number().required(),
              satisfaction: Joi.string().valid("BON", "MOYEN", "MAUVAIS").allow(null),
              label: Joi.string().required().max(250),
            })
          )
          .required()
          .max(10),
      }).validateAsync(req.body, { abortEarly: false });

      await questionnaires.answerToQuestion(
        token,
        questionId,
        reponses.map((r) => {
          return {
            ...r,
            label: sanitizeHtml(r.label),
          };
        }),
        { thematique }
      );

      res.json({});
    })
  );

  router.put(
    "/api/questionnaires/:token/markAsPending",
    tryCatch(async (req, res) => {
      let { token } = req.params;

      await questionnaires.markAsPending(token);

      res.json({});
    })
  );

  router.put(
    "/api/questionnaires/:token/close",
    tryCatch(async (req, res) => {
      let { token } = req.params;
      await Joi.object({}).validateAsync(req.body, { abortEarly: false });

      await questionnaires.close(token);

      res.json({});
    })
  );

  router.get(
    "/api/questionnaires/stats.:type",
    checkAuth,
    tryCatch(async (req, res) => {
      let { type } = await Joi.object({
        type: Joi.string().required().valid("json", "csv"),
      }).validateAsync(req.params, { abortEarly: false });

      let stream = db
        .collection("apprentis")
        .aggregate([
          { $project: { contrats: 1 } },
          { $unwind: "$contrats" },
          { $unwind: "$contrats.questionnaires" },
          {
            $group: {
              _id: {
                date: {
                  $dateToString: {
                    format: "%Y-%m-%d",
                    date: { $arrayElemAt: ["$contrats.questionnaires.sendDates", 0] },
                  },
                },
                type: "$contrats.questionnaires.type",
              },
              envoyes: {
                $sum: {
                  $cond: {
                    if: {
                      $in: ["$contrats.questionnaires.status", ["sent", "opened", "clicked", "inprogress", "closed"]],
                    },
                    then: 1,
                    else: 0,
                  },
                },
              },
              ouverts: {
                $sum: {
                  $cond: {
                    if: { $in: ["$contrats.questionnaires.status", ["opened", "clicked", "inprogress", "closed"]] },
                    then: 1,
                    else: 0,
                  },
                },
              },
              cliques: {
                $sum: {
                  $cond: {
                    if: { $in: ["$contrats.questionnaires.status", ["clicked", "inprogress", "closed"]] },
                    then: 1,
                    else: 0,
                  },
                },
              },
              enCours: {
                $sum: {
                  $cond: {
                    if: { $eq: ["$contrats.questionnaires.status", "inprogress"] },
                    then: 1,
                    else: 0,
                  },
                },
              },
              enAttente: {
                $sum: {
                  $cond: {
                    if: { $eq: ["$contrats.questionnaires.status", "pending"] },
                    then: 1,
                    else: 0,
                  },
                },
              },
              termines: {
                $sum: {
                  $cond: {
                    if: { $eq: ["$contrats.questionnaires.status", "closed"] },
                    then: 1,
                    else: 0,
                  },
                },
              },
              erreurs: {
                $sum: {
                  $cond: {
                    if: {
                      $in: ["$contrats.questionnaires.status", ["error"]],
                    },
                    then: 1,
                    else: 0,
                  },
                },
              },
            },
          },
          {
            $project: {
              _id: 0,
              date: "$_id.date",
              type: "$_id.type",
              envoyes: 1,
              ouverts: 1,
              cliques: 1,
              enCours: 1,
              enAttente: 1,
              termines: 1,
              erreurs: 1,
            },
          },
          { $sort: { date: 1, type: 1 } },
        ])
        .stream();

      if (type === "json") {
        return sendJsonStream(stream, res);
      } else {
        let csvStream = oleoduc(
          stream,
          transformData((res) => {
            return {
              Date: res.date,
              "Type de questionnaire": res.type,
              "Nombre de questionnaire envoyés": res.envoyes,
              "Emails ouverts": res.ouverts,
              "Liens cliqués": res.cliques,
              "Nombre de questionnaires en cours": res.enCours,
              "Nombre de questionnaires en attente": res.enAttente,
              "Nombre de questionnaires terminés": res.termines,
              "Nombre de questionnaires en erreur": res.erreurs,
            };
          })
        );

        return sendCSVStream(csvStream, res, { encoding: "UTF-8", filename: "questionnaires-stats.csv" });
      }
    })
  );

  return router;
};
