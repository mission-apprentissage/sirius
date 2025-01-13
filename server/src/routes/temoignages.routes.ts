// @ts-nocheck -- TODO

import express from "express";

import {
  createTemoignage,
  deleteMultipleTemoignages,
  deleteTemoignage,
  getDatavisualisation,
  getDatavisualisationEtablissement,
  getDatavisualisationFormation,
  getDatavisualisationFormationExists,
  getUncompliantTemoignages,
  getXlsExport,
  updateTemoignage,
} from "../controllers/temoignages.controller";
import { isAdmin } from "../middlewares/isAdmin";
import { validator } from "../middlewares/validatorMiddleware";
import { verifyUser } from "../middlewares/verifyUserMiddleware";
import { createTemoignageSchema, updateTemoignageSchema } from "../validators/temoignages.validators";

export const temoignages = () => {
  const router = express.Router();

  router.post("/api/temoignages/delete", verifyUser, isAdmin, (req, res, next) => {
    deleteMultipleTemoignages(req, res, next);
  });

  router.post("/api/temoignages/", validator(createTemoignageSchema), (req, res, next) => {
    createTemoignage(req, res, next);
  });

  router.delete("/api/temoignages/:id", verifyUser, isAdmin, (req, res, next) => {
    deleteTemoignage(req, res, next);
  });

  router.put("/api/temoignages/:id", validator(updateTemoignageSchema), (req, res, next) => {
    updateTemoignage(req, res, next);
  });

  router.get("/api/temoignages/datavisualisation/formation", (req, res, next) => {
    getDatavisualisationFormation(req, res, next);
  });

  router.get("/api/temoignages/formation/exists", (req, res, next) => {
    getDatavisualisationFormationExists(req, res, next);
  });

  router.get("/api/temoignages/datavisualisation/etablissement", (req, res, next) => {
    getDatavisualisationEtablissement(req, res, next);
  });

  router.post("/api/temoignages/datavisualisation", verifyUser, (req, res, next) => {
    getDatavisualisation(req, res, next);
  });

  router.get("/api/temoignages/uncompliant", verifyUser, isAdmin, (req, res, next) => {
    getUncompliantTemoignages(req, res, next);
  });

  router.post("/api/temoignages/xls-export", verifyUser, (req, res, next) => {
    getXlsExport(req, res, next);
  });

  return router;
};
