// @ts-nocheck -- TODO

import express from "express";

import {
  alreadyExistingFormations,
  createFormation,
  deleteFormation,
  getFormations,
  getFormationsWithTemoignageCount,
  updateFormation,
} from "../controllers/formations.controller";
import { isAdminOrAllowed, TYPES } from "../middlewares/isAdminOrAllowed";
import { validator } from "../middlewares/validatorMiddleware";
import { verifyUser } from "../middlewares/verifyUserMiddleware";
import {
  alreadyExistingFormationSchema,
  createFormationSchema,
  updateFormationSchema,
} from "../validators/formations.validators";

export const formations = () => {
  const router = express.Router();

  router.post(
    "/api/formations/",
    verifyUser,
    async (req, _res, next) => isAdminOrAllowed(req, next, TYPES.SIRET_IN_FORMATION),
    validator(createFormationSchema),
    (req, res, next) => {
      createFormation(req, res, next);
    }
  );

  router.get(
    "/api/formations/",
    verifyUser,
    async (req, _res, next) => isAdminOrAllowed(req, next, TYPES.FORMATION_IDS),
    (req, res, next) => {
      getFormations(req, res, next);
    }
  );

  router.get("/api/formations/temoignage-count", (req, res, next) => {
    getFormationsWithTemoignageCount(req, res, next);
  });

  // unused at the moment
  /*router.get("/api/formations/:id", verifyUser, (req, res, next) => {
    getFormation(req, res, next);
  });*/

  router.delete(
    "/api/formations/:id",
    verifyUser,
    async (req, _res, next) => isAdminOrAllowed(req, next, TYPES.FORMATION_ID),
    (req, res, next) => {
      deleteFormation(req, res, next);
    }
  );

  router.put(
    "/api/formations/:id",
    verifyUser,
    async (req, _res, next) => isAdminOrAllowed(req, next, TYPES.FORMATION_ID),
    validator(updateFormationSchema),
    (req, res, next) => {
      updateFormation(req, res, next);
    }
  );

  router.post(
    "/api/formations/already-existing",
    verifyUser,
    validator(alreadyExistingFormationSchema),
    (req, res, next) => {
      alreadyExistingFormations(req, res, next);
    }
  );

  return router;
};
