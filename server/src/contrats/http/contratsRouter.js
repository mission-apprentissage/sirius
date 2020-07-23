const express = require("express");
const tryCatch = require("../../core/http/tryCatchMiddleware");
const ObjectID = require("mongodb").ObjectID;
const Boom = require("boom");

module.exports = ({ contrats }) => {
  const router = express.Router(); // eslint-disable-line new-cap

  router.get(
    "/api/contrats/:id/unsubscribe",
    tryCatch(async (req, res) => {
      let { id } = req.params;
      if (!ObjectID.isValid(id)) {
        throw Boom.badRequest("Identifiant invalide");
      }

      await contrats.unsubscribe(new ObjectID(id));

      res.json({ message: "Votre demande à bien été prise en compte" });
    })
  );

  return router;
};
