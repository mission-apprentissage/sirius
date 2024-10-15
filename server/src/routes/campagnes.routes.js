const express = require("express");
const validator = require("../middlewares/validatorMiddleware");
const { createCampagneSchema, createMultiCampagneSchema } = require("../validators/campagnes.validators");
const {
  getCampagnes,
  getCampagne,
  createCampagnes,
  deleteCampagnes,
  updateCampagne,
  getPdfExport,
  getPdfMultipleExport,
  getXlsxMultipleExport,
  getCampagnesStatistics,
} = require("../controllers/campagnes.controller");
const { verifyUser } = require("../middlewares/verifyUserMiddleware");
const { isAdminOrAllowed, TYPES } = require("../middlewares/isAdminOrAllowed");
const { isAdmin } = require("../middlewares/isAdmin");

const campagnes = () => {
  const router = express.Router();

  router.get("/api/campagnes/", verifyUser, (req, res, next) => {
    getCampagnes(req, res, next);
  });

  router.post("/api/campagnes/statistics", verifyUser, (req, res, next) => {
    getCampagnesStatistics(req, res, next);
  });

  router.post(
    "/api/campagnes",
    verifyUser,
    (req, res, next) => isAdminOrAllowed(req, next, TYPES.ETABLISSEMENT_FORMATEUR_SIRET),
    validator(createMultiCampagneSchema),
    (req, res, next) => {
      createCampagnes(req, res, next);
    }
  );

  router.delete(
    "/api/campagnes",
    verifyUser,
    (req, res, next) => isAdminOrAllowed(req, next, TYPES.CAMPAGNE_IDS),
    (req, res, next) => {
      deleteCampagnes(req, res, next);
    }
  );

  router.put(
    "/api/campagnes/:id",
    verifyUser,
    (req, res, next) => isAdminOrAllowed(req, next, TYPES.CAMPAGNE_ID),
    validator(createCampagneSchema),
    (req, res, next) => {
      updateCampagne(req, res, next);
    }
  );

  router.get(
    "/api/campagnes/export/pdf/multi",
    verifyUser,
    (req, res, next) => isAdminOrAllowed(req, next, TYPES.CAMPAGNE_IDS),
    (req, res, next) => {
      getPdfMultipleExport(req, res, next);
    }
  );

  router.get(
    "/api/campagnes/export/pdf/:id",
    verifyUser,
    (req, res, next) => isAdminOrAllowed(req, next, TYPES.CAMPAGNE_ID),
    (req, res, next) => {
      getPdfExport(req, res, next);
    }
  );

  router.get("/api/campagnes/export/xlsx/multi", verifyUser, isAdmin, (req, res, next) => {
    getXlsxMultipleExport(req, res, next);
  });

  router.get("/api/campagnes/:id", (req, res, next) => {
    getCampagne(req, res, next);
  });

  return router;
};

module.exports = campagnes;
