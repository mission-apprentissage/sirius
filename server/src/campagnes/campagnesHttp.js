const express = require("express");
const tryCatch = require("../core/http/tryCatchMiddleware");
const validator = require("../core/http/validatorMiddleware");
const createCampagneSchema = require("./validators");

const campagnesHttp = ({ campagnes }) => {
  const router = express.Router();

  router.post(
    "/api/campagnes/",
    validator(createCampagneSchema),
    tryCatch(async (req, res) => {
      const campagne = await campagnes.create(req.body);
      if (campagne.result.ok === 1) {
        return res.status(201).json(campagne.ops[0]);
      } else {
        return res.status(500).json(campagne);
      }
    })
  );

  return router;
};

module.exports = campagnesHttp;
