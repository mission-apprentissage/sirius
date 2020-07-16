const express = require("express");
const tryCatch = require("../middlewares/tryCatchMiddleware");
const _ = require("lodash");
const Joi = require("@hapi/joi");
const Boom = require("boom");

module.exports = ({ db }) => {
  const router = express.Router(); // eslint-disable-line new-cap

  router.get(
    "/api/questionnaires/:token",
    tryCatch(async (req, res) => {
      let { token } = await Joi.object({
        token: Joi.string().required(),
      }).validateAsync(req.params, { abortEarly: false });

      let apprenti = await db.collection("apprentis").findOne({ token });

      if (!apprenti) {
        throw Boom.badRequest("Token invalide");
      }

      res.json(_.pick(apprenti, ["prenom", "nom", "formation"]));
    })
  );

  return router;
};
