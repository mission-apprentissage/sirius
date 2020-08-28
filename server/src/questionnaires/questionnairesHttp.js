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

  router.put(
    "/api/questionnaires/:token/open",
    tryCatch(async (req, res) => {
      let { token } = req.params;

      res.json(await questionnaires.open(token));
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
    "/api/questionnaires/:token/email",
    tryCatch(async (req, res) => {
      let { token } = req.params;

      const html = await questionnaires.previewEmail(token);

      sendHTML(html, res);
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
              _id: { cohorte: "$cohorte", status: "$questionnaires.status" },
              count: { $sum: 1 },
            },
          },
          {
            $project: {
              _id: 0,
              cohorte: "$_id.cohorte",
              status: "$_id.status",
              count: 1,
            },
          },
          { $sort: { cohorte: 1, status: -1 } },
        ])
        .stream();

      if (type === "csv") {
        let csvStream = oleoduc(
          resultsStream,
          transformObjectIntoCSV({
            cohorte: (res) => res.cohorte,
            statut: (res) => res.status,
            nombre: (res) => res.count,
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
