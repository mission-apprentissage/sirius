const express = require("express");
const tryCatch = require("../core/http/tryCatchMiddleware");
const validator = require("../core/http/validatorMiddleware");
const createTemoignageSchema = require("./validators");
const { BasicError } = require("../core/errors");

const temoignagesHttp = ({ temoignagesController }) => {
  const router = express.Router();

  router.post(
    "/api/temoignages/",
    validator(createTemoignageSchema),
    tryCatch(async (req, res) => {
      const temoignage = await temoignagesController.create(req.body);

      if (temoignage._id) {
        return res.status(201).json(temoignage);
      } else {
        throw new BasicError();
      }
    })
  );

  return router;
};

module.exports = temoignagesHttp;
