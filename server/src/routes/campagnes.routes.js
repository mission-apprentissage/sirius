const express = require("express");
const validator = require("../middlewares/validatorMiddleware");
const createCampagneSchema = require("../validators/campagnes.validators");
const {
  getCampagnes,
  getCampagne,
  createCampagne,
  deleteCampagne,
  updateCampagne,
} = require("../controllers/campagnes.controller");

const campagnes = () => {
  const router = express.Router();

  router.get("/api/campagnes/", (req, res, next) => {
    getCampagnes(req, res, next);
  });

  router.post("/api/campagnes/", validator(createCampagneSchema), (req, res, next) => {
    createCampagne(req, res, next);
  });

  router.get("/api/campagnes/:id", (req, res, next) => {
    getCampagne(req, res, next);
  });

  router.delete("/api/campagnes/:id", (req, res, next) => {
    deleteCampagne(req, res, next);
  });

  router.put("/api/campagnes/:id", validator(createCampagneSchema), (req, res, next) => {
    updateCampagne(req, res, next);
  });

  return router;
};

module.exports = campagnes;
