const express = require("express");
const validator = require("../middlewares/validatorMiddleware");
const { createEtablissementSchema, updateEtablissementSchema } = require("../validators/etablissements.validators");
const {
  createEtablissement,
  getEtablissements,
  getEtablissement,
  deleteEtablissement,
  updateEtablissement,
} = require("../controllers/etablissements.controller");
const { verifyUser } = require("../middlewares/verifyUserMiddleware");

const etablissements = () => {
  const router = express.Router();

  router.post("/api/etablissements/", verifyUser, validator(createEtablissementSchema), (req, res, next) => {
    createEtablissement(req, res, next);
  });

  router.get("/api/etablissements/", verifyUser, (req, res, next) => {
    getEtablissements(req, res, next);
  });

  router.get("/api/etablissements/:id", verifyUser, (req, res, next) => {
    getEtablissement(req, res, next);
  });

  router.delete("/api/etablissements/:id", verifyUser, (req, res, next) => {
    deleteEtablissement(req, res, next);
  });

  router.put("/api/etablissements/:id", verifyUser, validator(updateEtablissementSchema), (req, res, next) => {
    updateEtablissement(req, res, next);
  });

  return router;
};

module.exports = etablissements;
