const express = require("express");
const tryCatch = require("../core/http/tryCatchMiddleware");
const { sendHTML } = require("../core/http/httpUtils");
const authMiddleware = require("../core/http/authMiddleware");
const { sendCSVStream } = require("../core/http/httpUtils");
const { promiseAllProps } = require("../core/asyncUtils");
const questionnairesCSVStream = require("./questionnairesCSVStream");
const Joi = require("@hapi/joi");

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
    "/api/questionnaires/stats",
    checkAuth,
    tryCatch(async (req, res) => {
      let json = await promiseAllProps({
        nbQuestionnaires: db.collection("contrats").count({ "questionnaires.0": { $exists: true } }),
        ouverts: db.collection("contrats").count({ "questionnaires.status": "opened" }),
        enCours: db.collection("contrats").count({ "questionnaires.status": "inprogress" }),
        termines: db.collection("contrats").count({ "questionnaires.status": "closed" }),
      });

      res.json(json);
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
