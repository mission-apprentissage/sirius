// @ts-nocheck -- TODO

import express from "express";

import {
  createFormation,
  deleteFormation,
  getFormations,
  getFormationsEtablissementsDiplomesWithCampagnesCount,
  getFormationsWithTemoignageCount,
  updateFormation,
} from "../controllers/formations.controller";
import { isAdminOrAllowed, TYPES } from "../middlewares/isAdminOrAllowed";
import { validator } from "../middlewares/validatorMiddleware";
import { verifyUser } from "../middlewares/verifyUserMiddleware";
import { createFormationSchema, updateFormationSchema } from "../validators/formations.validators";

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

  router.get("/api/formations/diplomes-and-etablissements-filters", verifyUser, (req, res, next) => {
    getFormationsEtablissementsDiplomesWithCampagnesCount(req, res, next);
  });

  return router;
};
