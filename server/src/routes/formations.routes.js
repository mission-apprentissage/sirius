const express = require("express");
const validator = require("../middlewares/validatorMiddleware");
const { createFormationSchema, updateFormationSchema } = require("../validators/formations.validators");
const {
  createFormation,
  deleteFormation,
  updateFormation,
  getFormations,
  getFormationsWithTemoignageCount,
  getFormationsDiplomesWithCampagnes,
} = require("../controllers/formations.controller");
const { verifyUser } = require("../middlewares/verifyUserMiddleware");
const { isAdminOrAllowed, TYPES } = require("../middlewares/isAdminOrAllowed");

const formations = () => {
  const router = express.Router();

  router.post(
    "/api/formations/",
    verifyUser,
    (req, res, next) => isAdminOrAllowed(req, next, TYPES.SIRET_IN_FORMATION),
    validator(createFormationSchema),
    (req, res, next) => {
      createFormation(req, res, next);
    }
  );

  router.get(
    "/api/formations/",
    verifyUser,
    (req, res, next) => isAdminOrAllowed(req, next, TYPES.FORMATION_IDS),
    (req, res, next) => {
      getFormations(req, res, next);
    }
  );

  router.get("/api/formations/temoignage-count", (req, res, next) => {
    getFormationsWithTemoignageCount(req, res, next);
  });

  router.delete(
    "/api/formations/:id",
    verifyUser,
    (req, res, next) => isAdminOrAllowed(req, next, TYPES.FORMATION_ID),
    (req, res, next) => {
      deleteFormation(req, res, next);
    }
  );

  router.put(
    "/api/formations/:id",
    verifyUser,
    (req, res, next) => isAdminOrAllowed(req, next, TYPES.FORMATION_ID),
    validator(updateFormationSchema),
    (req, res, next) => {
      updateFormation(req, res, next);
    }
  );

  router.get(
    "/api/formations/diplomes-with-campagnes",
    verifyUser,
    (req, res, next) => isAdminOrAllowed(req, next, TYPES.FORMATION_IDS),
    (req, res, next) => {
      getFormationsDiplomesWithCampagnes(req, res, next);
    }
  );

  return router;
};

module.exports = formations;
