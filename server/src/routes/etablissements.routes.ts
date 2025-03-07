import express from "express";

import {
  createEtablissement,
  getEtablissements,
  getEtablissementsPublicStatistics,
  getEtablissementsSuivi,
  getEtablissementsWithTemoignageCount,
} from "../controllers/etablissements.controller";
import { isAdmin } from "../middlewares/isAdmin";
import { isAdminOrAllowed, TYPES } from "../middlewares/isAdminOrAllowed";
import { validator } from "../middlewares/validatorMiddleware";
import { verifyUser } from "../middlewares/verifyUserMiddleware";
import { createEtablissementSchema } from "../validators/etablissements.validators";

export const etablissements = () => {
  const router = express.Router();

  router.post("/api/etablissements/", verifyUser, isAdmin, validator(createEtablissementSchema), (req, res, next) => {
    createEtablissement(req, res, next);
  });

  router.get(
    "/api/etablissements/",
    verifyUser,
    async (req, _res, next) => isAdminOrAllowed(req, next, TYPES.SIRET),
    (req, res, next) => {
      getEtablissements(req, res, next);
    }
  );

  // utilisé par l'extension
  router.get("/api/etablissements/temoignage-count", (req, res, next) => {
    getEtablissementsWithTemoignageCount(req, res, next);
  });

  router.get("/api/etablissements/suivi", verifyUser, isAdmin, (req, res, next) => {
    getEtablissementsSuivi(req, res, next);
  });

  router.get("/api/etablissements/public/statistics", (req, res, next) => {
    getEtablissementsPublicStatistics(req, res, next);
  });

  return router;
};
