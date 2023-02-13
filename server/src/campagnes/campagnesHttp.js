const express = require("express");
const tryCatch = require("../core/http/tryCatchMiddleware");
const validator = require("../core/http/validatorMiddleware");
const createCampagneSchema = require("./validators");
const { BasicError, CampagneNotFoundError } = require("../core/errors");

const campagnesHttp = ({ campagnesController }) => {
  const router = express.Router();

  router.get(
    "/api/campagnes/",
    tryCatch(async (req, res) => {
      const campagnes = await campagnesController.getAll();
      return res.status(200).json(campagnes);
    })
  );

  router.post(
    "/api/campagnes/",
    validator(createCampagneSchema),
    tryCatch(async (req, res) => {
      const campagne = await campagnesController.create(req.body);
      if (campagne.result.ok === 1) {
        return res.status(201).json(campagne.ops[0]);
      } else {
        throw new BasicError();
      }
    })
  );

  router.get(
    "/api/campagnes/:id",
    tryCatch(async (req, res) => {
      const campagne = await campagnesController.getOne(req.params.id);
      if (!campagne) {
        throw new CampagneNotFoundError();
      }
      return res.status(200).json(campagne);
    })
  );

  router.delete(
    "/api/campagnes/:id",
    tryCatch(async (req, res) => {
      const campagne = await campagnesController.deleteOne(req.params.id);
      if (campagne.deletedCount === 1) {
        return res.status(200).json({ message: "ok" });
      } else {
        throw new CampagneNotFoundError();
      }
    })
  );

  return router;
};

module.exports = campagnesHttp;
