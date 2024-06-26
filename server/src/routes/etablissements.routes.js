const express = require("express");
const validator = require("../middlewares/validatorMiddleware");
const { createEtablissementSchema, updateEtablissementSchema } = require("../validators/etablissements.validators");
const {
  createEtablissement,
  getEtablissements,
  getEtablissement,
  deleteEtablissement,
  updateEtablissement,
  getEtablissementsSuivi,
  getEtablissementsPublicStatistics,
  getEtablissementsWithTemoignageCount,
} = require("../controllers/etablissements.controller");
const { verifyUser } = require("../middlewares/verifyUserMiddleware");
const { isAdmin } = require("../middlewares/isAdmin");
const { isAdminOrAllowed, TYPES } = require("../middlewares/isAdminOrAllowed");

const etablissements = () => {
  const router = express.Router();

  router.post("/api/etablissements/", verifyUser, isAdmin, validator(createEtablissementSchema), (req, res, next) => {
    createEtablissement(req, res, next);
  });

  router.get(
    "/api/etablissements/",
    verifyUser,
    (req, res, next) => isAdminOrAllowed(req, next, TYPES.SIRET),
    (req, res, next) => {
      getEtablissements(req, res, next);
    }
  );

  router.get("/api/etablissements/temoignage-count", (req, res, next) => {
    getEtablissementsWithTemoignageCount(req, res, next);
  });

  router.get("/api/etablissements/suivi", verifyUser, isAdmin, (req, res, next) => {
    getEtablissementsSuivi(req, res, next);
  });

  router.get("/api/etablissements/public/statistics", (req, res, next) => {
    getEtablissementsPublicStatistics(req, res, next);
  });

  router.get(
    "/api/etablissements/:id",
    verifyUser,
    (req, res, next) => isAdminOrAllowed(req, next, TYPES.ETABLISSEMENT_ID),
    (req, res, next) => {
      getEtablissement(req, res, next);
    }
  );

  router.delete(
    "/api/etablissements/:id",
    (req, res, next) => isAdminOrAllowed(req, next, TYPES.ETABLISSEMENT_ID),
    verifyUser,
    (req, res, next) => {
      deleteEtablissement(req, res, next);
    }
  );

  router.put(
    "/api/etablissements/:id",
    verifyUser,
    (req, res, next) => isAdminOrAllowed(req, next, TYPES.ETABLISSEMENT_ID),
    validator(updateEtablissementSchema),
    (req, res, next) => {
      updateEtablissement(req, res, next);
    }
  );

  return router;
};

module.exports = etablissements;
