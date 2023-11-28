const express = require("express");
const validator = require("../middlewares/validatorMiddleware");
const { createCampagneSchema, createMultiCampagneSchema } = require("../validators/campagnes.validators");
const {
  getCampagnes,
  getCampagne,
  createCampagne,
  deleteCampagnes,
  updateCampagne,
  createMultiCampagne,
  getExport,
  getMultipleExport,
} = require("../controllers/campagnes.controller");
const { verifyUser } = require("../middlewares/verifyUserMiddleware");
const { isAdminOrAllowed, TYPES } = require("../middlewares/isAdminOrAllowed");

const campagnes = () => {
  const router = express.Router();

  router.get(
    "/api/campagnes/",
    verifyUser,
    (req, res, next) => isAdminOrAllowed(req, next, TYPES.SIRET),
    (req, res, next) => {
      getCampagnes(req, res, next);
    }
  );

  router.post("/api/campagnes/", verifyUser, validator(createCampagneSchema), (req, res, next) => {
    createCampagne(req, res, next);
  });

  router.post(
    "/api/campagnes/multi",
    verifyUser,
    (req, res, next) => isAdminOrAllowed(req, next, TYPES.SIRET),
    validator(createMultiCampagneSchema),
    (req, res, next) => {
      createMultiCampagne(req, res, next);
    }
  );

  router.delete(
    "/api/campagnes",
    verifyUser,
    (req, res, next) => isAdminOrAllowed(req, next, TYPES.CAMPAGNE_ID),
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
    "/api/campagnes/export/:id",
    verifyUser,
    (req, res, next) => isAdminOrAllowed(req, next, TYPES.CAMPAGNE_ID),
    (req, res, next) => {
      getExport(req, res, next);
    }
  );

  router.get(
    "/api/campagnes/multiexport",
    verifyUser,
    (req, res, next) => isAdminOrAllowed(req, next, TYPES.CAMPAGNE_IDS),
    (req, res, next) => {
      getMultipleExport(req, res, next);
    }
  );

  router.get("/api/campagnes/:id", (req, res, next) => {
    getCampagne(req, res, next);
  });

  return router;
};

module.exports = campagnes;
