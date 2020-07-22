const express = require("express");
const tryCatch = require("../middlewares/tryCatchMiddleware");
const Joi = require("@hapi/joi");

module.exports = ({ questionnaires }) => {
  const router = express.Router(); // eslint-disable-line new-cap

  router.put(
    "/api/questionnaires/:token/open",
    tryCatch(async (req, res) => {
      let { token } = req.params;

      let meta = await questionnaires.open(token);

      res.json(meta);
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

  return router;
};
