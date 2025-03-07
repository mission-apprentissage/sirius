import express from "express";

import {
  getFormations,
  getFormationsEtablissementsDiplomesWithCampagnesCount,
  getFormationsWithTemoignageCount,
} from "../controllers/formations.controller";
import { isAdminOrAllowed, TYPES } from "../middlewares/isAdminOrAllowed";
import { verifyUser } from "../middlewares/verifyUserMiddleware";

export const formations = () => {
  const router = express.Router();

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

  router.get("/api/formations/diplomes-and-etablissements-filters", verifyUser, (req, res, next) => {
    getFormationsEtablissementsDiplomesWithCampagnesCount(req, res, next);
  });

  return router;
};
