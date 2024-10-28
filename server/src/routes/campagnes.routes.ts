// @ts-nocheck -- TODO
import express from "express";

import {
  createCampagnes,
  deleteCampagnes,
  getCampagne,
  getCampagnes,
  getCampagnesStatistics,
  getPdfExport,
  getPdfMultipleExport,
  getXlsxMultipleExport,
  updateCampagne,
} from "../controllers/campagnes.controller";
import { isAdmin } from "../middlewares/isAdmin";
import { isAdminOrAllowed, TYPES } from "../middlewares/isAdminOrAllowed";
import { validator } from "../middlewares/validatorMiddleware";
import { verifyUser } from "../middlewares/verifyUserMiddleware";
import { createCampagneSchema, createMultiCampagneSchema } from "../validators/campagnes.validators";

export const campagnes = () => {
  const router = express.Router();

  router.post(
    "/api/campagnes/create",
    verifyUser,
    async (req, _res, next) => isAdminOrAllowed(req, next, TYPES.ETABLISSEMENT_FORMATEUR_SIRET),
    validator(createMultiCampagneSchema),
    (req, res, next) => {
      createCampagnes(req, res, next);
    }
  );

  router.post("/api/campagnes/", verifyUser, (req, res, next) => {
    getCampagnes(req, res, next);
  });

  router.post("/api/campagnes/statistics", verifyUser, (req, res, next) => {
    getCampagnesStatistics(req, res, next);
  });

  router.delete(
    "/api/campagnes",
    verifyUser,
    async (req, _res, next) => isAdminOrAllowed(req, next, TYPES.CAMPAGNE_IDS),
    (req, res, next) => {
      deleteCampagnes(req, res, next);
    }
  );

  router.put(
    "/api/campagnes/:id",
    verifyUser,
    async (req, _res, next) => isAdminOrAllowed(req, next, TYPES.CAMPAGNE_ID),
    validator(createCampagneSchema),
    (req, res, next) => {
      updateCampagne(req, res, next);
    }
  );

  router.get(
    "/api/campagnes/export/pdf/multi",
    verifyUser,
    async (req, _res, next) => isAdminOrAllowed(req, next, TYPES.CAMPAGNE_IDS),
    (req, res, next) => {
      getPdfMultipleExport(req, res, next);
    }
  );

  router.get(
    "/api/campagnes/export/pdf/:id",
    verifyUser,
    async (req, _res, next) => isAdminOrAllowed(req, next, TYPES.CAMPAGNE_ID),
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
