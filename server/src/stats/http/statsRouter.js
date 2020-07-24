const express = require("express");
const tryCatch = require("../../core/http/tryCatchMiddleware");
const { promiseAll } = require("../../core/asyncUtils");

module.exports = ({ db }) => {
  const router = express.Router(); // eslint-disable-line new-cap

  router.get(
    "/api/stats",
    tryCatch(async (req, res) => {
      let json = await promiseAll({
        nbQuestionnaires: db.collection("contrats").count({ "questionnaires.0": { $exists: true } }),
        ouverts: db.collection("contrats").count({ "questionnaires.status": "opened" }),
        enCours: db.collection("contrats").count({ "questionnaires.status": "inprogress" }),
        termines: db.collection("contrats").count({ "questionnaires.status": "closed" }),
      });

      res.json(json);
    })
  );

  return router;
};
