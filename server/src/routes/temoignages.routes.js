const express = require("express");
const validator = require("../middlewares/validatorMiddleware");
const createTemoignageSchema = require("../validators/temoignages.validators");
const { createTemoignage } = require("../controllers/temoignages.controller");

const temoignages = () => {
  const router = express.Router();

  router.post("/api/temoignages/", validator(createTemoignageSchema), (req, res, next) => {
    createTemoignage(req, res, next);
  });

  return router;
};

module.exports = temoignages;
