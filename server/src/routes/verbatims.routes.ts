import express from "express";

import { createVerbatim, getVerbatims, getVerbatimsCount, patchVerbatims } from "../controllers/verbatims.controller";
import { isAdmin } from "../middlewares/isAdmin";
import { validator } from "../middlewares/validatorMiddleware";
import { verifyUser } from "../middlewares/verifyUserMiddleware";
import { patchMultiVerbatims } from "../validators/verbatims.validators";

export const verbatims = () => {
  const router = express.Router();

  router.post("/api/verbatims/", (req, res, next) => {
    createVerbatim(req, res, next);
  });

  router.get("/api/verbatims/count", verifyUser, isAdmin, (req, res, next) => {
    getVerbatimsCount(req, res, next);
  });

  router.get("/api/verbatims/", verifyUser, isAdmin, (req, res, next) => {
    getVerbatims(req, res, next);
  });

  router.patch("/api/verbatims/", verifyUser, isAdmin, validator(patchMultiVerbatims), (req, res, next) => {
    patchVerbatims(req, res, next);
  });

  return router;
};
