const express = require("express");
const Joi = require("@hapi/joi");
const { oleoduc, jsonStream } = require("oleoduc");
const { transformObjectIntoCSV } = require("../core/streamUtils");
const tryCatch = require("../core/http/tryCatchMiddleware");
const { sendHTML, sendJsonStream, sendCSVStream } = require("../core/http/httpUtils");
const authMiddleware = require("../core/http/authMiddleware");
const questionnairesCSVStream = require("./questionnairesCSVStream");

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
      res.end(Buffer.from("R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=", "base64"), "binary");
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
    "/api/questionnaires/:token/addReponse",
    tryCatch(async (req, res) => {
      let { token } = req.params;
      let reponse = await Joi.object({
        id: Joi.string().required(),
        data: Joi.any().required(),
      }).validateAsync(req.body, { abortEarly: false });

      await questionnaires.addReponse(token, reponse);

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

      let resultsStream = db
        .collection("contrats")
        .aggregate([
          { $project: { cohorte: 1, questionnaires: 1 } },
          { $unwind: "$questionnaires" },
          {
            $group: {
              _id: { cohorte: "$cohorte" },
              total: { $sum: 1 },
              ouverts: {
                $sum: {
                  $cond: {
                    if: { $in: ["$questionnaires.status", ["opened", "clicked", "inprogress", "closed"]] },
                    then: 1,
                    else: 0,
                  },
                },
              },
              cliques: {
                $sum: {
                  $cond: {
                    if: { $in: ["$questionnaires.status", ["clicked", "inprogress", "closed"]] },
                    then: 1,
                    else: 0,
                  },
                },
              },
              enCours: {
                $sum: {
                  $cond: {
                    if: { $eq: ["$questionnaires.status", "inprogress"] },
                    then: 1,
                    else: 0,
                  },
                },
              },
              termines: {
                $sum: {
                  $cond: {
                    if: { $eq: ["$questionnaires.status", "closed"] },
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
              cohorte: "$_id.cohorte",
              total: 1,
              ouverts: 1,
              cliques: 1,
              status: {
                enCours: "$enCours",
                termines: "$termines",
              },
            },
          },
          { $sort: { cohorte: 1 } },
        ])
        .stream();

      if (type === "csv") {
        let csvStream = oleoduc(
          resultsStream,
          transformObjectIntoCSV({
            cohorte: (res) => res.cohorte,
            "Nombre de questionnaire envoyés": (res) => res.total,
            "Emails ouverts": (res) => res.ouverts,
            "Liens cliqués": (res) => res.cliques,
            "Nombre de questionnaires en cours": ({ status }) => status.enCours,
            "Nombre de questionnaires terminés": ({ status }) => status.termines,
          })
        );

        return sendCSVStream(csvStream, res, { encoding: "UTF-8", filename: "questionnaires-stats.csv" });
      } else {
        return sendJsonStream(oleoduc(resultsStream, jsonStream()), res);
      }
    })
  );

  router.get(
    "/api/questionnaires/export",
    checkAuth,
    tryCatch(async (req, res) => {
      sendCSVStream(questionnairesCSVStream(db), res, { encoding: "UTF-8", filename: "questionnaires.csv" });
    })
  );

  return router;
};
