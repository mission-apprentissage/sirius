import express from "express";

import {
  createQuestionnaire,
  deleteQuestionnaire,
  getQuestionnaire,
  getQuestionnaires,
  updateQuestionnaire,
} from "../controllers/questionnaires.controller";
import { isAdmin } from "../middlewares/isAdmin";
import { validator } from "../middlewares/validatorMiddleware";
import { verifyUser } from "../middlewares/verifyUserMiddleware";
import { createQuestionnaireSchema, updateQuestionnaireSchema } from "../validators/questionnaires.validators";

export const questionnaires = () => {
  const router = express.Router();

  router.post("/api/questionnaires/", verifyUser, isAdmin, validator(createQuestionnaireSchema), (req, res, next) => {
    createQuestionnaire(req, res, next);
  });

  router.get("/api/questionnaires/", (req, res, next) => {
    getQuestionnaires(req, res, next);
  });

  router.get("/api/questionnaires/:id", (req, res, next) => {
    getQuestionnaire(req, res, next);
  });

  router.delete("/api/questionnaires/:id", verifyUser, isAdmin, (req, res, next) => {
    deleteQuestionnaire(req, res, next);
  });

  router.put("/api/questionnaires/:id", verifyUser, isAdmin, validator(updateQuestionnaireSchema), (req, res, next) => {
    updateQuestionnaire(req, res, next);
  });

  return router;
};
