// @ts-nocheck -- TODO

import express from "express";

import {
  createEtablissement,
  deleteEtablissement,
  getEtablissement,
  getEtablissements,
  getEtablissementsPublicStatistics,
  getEtablissementsSuivi,
  getEtablissementsWithCampagnesCount,
  getEtablissementsWithTemoignageCount,
  updateEtablissement,
} from "../controllers/etablissements.controller";
import { isAdmin } from "../middlewares/isAdmin";
import { isAdminOrAllowed, TYPES } from "../middlewares/isAdminOrAllowed";
import { validator } from "../middlewares/validatorMiddleware";
import { verifyUser } from "../middlewares/verifyUserMiddleware";
import { createEtablissementSchema, updateEtablissementSchema } from "../validators/etablissements.validators";

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

  router.get("/api/etablissements/with-campagnes-count", verifyUser, (req, res, next) => {
    getEtablissementsWithCampagnesCount(req, res, next);
  });

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
    async (req, _res, next) => isAdminOrAllowed(req, next, TYPES.ETABLISSEMENT_ID),
    (req, res, next) => {
      getEtablissement(req, res, next);
    }
  );

  router.delete(
    "/api/etablissements/:id",
    async (req, _res, next) => isAdminOrAllowed(req, next, TYPES.ETABLISSEMENT_ID),
    verifyUser,
    (req, res, next) => {
      deleteEtablissement(req, res, next);
    }
  );

  router.put(
    "/api/etablissements/:id",
    verifyUser,
    async (req, _res, next) => isAdminOrAllowed(req, next, TYPES.ETABLISSEMENT_ID),
    validator(updateEtablissementSchema),
    (req, res, next) => {
      updateEtablissement(req, res, next);
    }
  );

  return router;
};
