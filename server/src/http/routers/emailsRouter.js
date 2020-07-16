const express = require("express");
const Joi = require("@hapi/joi");
const tryCatch = require("../middlewares/tryCatchMiddleware");

let anonymous = {
  prenom: "Marie",
  nom: "Louise",
  email: "ml@apprentissage.fr",
  token: "123456789",
  formation: {
    intitule: "CAP Boucher à Institut régional de formation des métiers de l'artisanat",
  },
};

module.exports = ({ db, mailer }) => {
  const router = express.Router(); // eslint-disable-line new-cap
  const { renderEmail } = mailer;

  router.get(
    "/api/emails/:templateName",
    tryCatch(async (req, res) => {
      let { templateName, token } = await Joi.object({
        templateName: Joi.string().required(),
        token: Joi.string(),
      }).validateAsync({ ...req.query, ...req.params }, { abortEarly: false });

      let apprenti = await db.collection("apprentis").findOne({ token });
      const html = await renderEmail(templateName, apprenti || anonymous);

      res.set("Content-Type", "text/html");
      res.send(Buffer.from(html));
    })
  );

  return router;
};
