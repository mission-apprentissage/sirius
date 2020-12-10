const express = require("express");
const tryCatch = require("../core/http/tryCatchMiddleware");

module.exports = ({ apprentis, entreprises }) => {
  const router = express.Router(); // eslint-disable-line new-cap

  router.get(
    "/api/unsubscribe/:email",
    tryCatch(async (req, res) => {
      let { email } = req.params;

      await Promise.all([apprentis.unsubscribe(email), entreprises.unsubscribe(email)]);

      res.json({ message: "Votre demande à bien été prise en compte" });
    })
  );

  return router;
};
