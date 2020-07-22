const express = require("express");
const { pick } = require("lodash");
const tryCatch = require("../../core/http/tryCatchMiddleware");
const Joi = require("@hapi/joi");

const anonymous = {
  prenom: "Marie",
  nom: "Louise",
  email: "ml@apprentissage.fr",
  formation: {
    intitule: "CAP Boucher à Institut régional de formation des métiers de l'artisanat",
  },
};

module.exports = ({ questionnaires }) => {
  const router = express.Router(); // eslint-disable-line new-cap

  router.put(
    "/api/questionnaires/:token/open",
    tryCatch(async (req, res) => {
      let { token } = req.params;

      let questionnaire = await questionnaires.open(token);

      res.json(pick(questionnaire, ["type", "meta"]));
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

      const html = await questionnaires.previewEmail(token, { anonymous });

      res.set("Content-Type", "text/html");
      res.send(Buffer.from(html));
    })
  );

  return router;
};
