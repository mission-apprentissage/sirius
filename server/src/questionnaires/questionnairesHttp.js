const express = require("express");
const Joi = require("@hapi/joi");
const { oleoduc, transformObject } = require("oleoduc");
const tryCatch = require("../core/http/tryCatchMiddleware");
const { sendHTML, sendJsonStream, sendCSVStream } = require("../core/http/httpUtils");
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

  router.put(
    "/api/questionnaires/:token/markAsClicked",
    tryCatch(async (req, res) => {
      let { token } = req.params;

      res.json(await questionnaires.markAsClicked(token));
    })
  );

  router.put(
    "/api/questionnaires/:token/answerToQuestion/:questionId",
    tryCatch(async (req, res) => {
      let { token, questionId } = req.params;
      let reponses = await Joi.array()
        .items(
          Joi.object({
            id: Joi.number().required(),
            satisfaction: Joi.string().allow("BON", "MOYEN", "MAUVAIS"),
            label: Joi.string().required(),
          })
        )
        .required()
        .validateAsync(req.body, { abortEarly: false });

      await questionnaires.answerToQuestion(token, questionId, reponses);

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
        type: Joi.string().required().allow("json", "csv"),
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
          transformObject((res) => {
            return {
              Date: res.date,
              "Type de questionnaire": res.type,
              "Nombre de questionnaire envoyés": res.envoyes,
              "Emails ouverts": res.ouverts,
              "Liens cliqués": res.cliques,
              "Nombre de questionnaires en cours": res.enCours,
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
