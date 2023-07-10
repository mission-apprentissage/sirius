const express = require("express");
const validator = require("../middlewares/validatorMiddleware");
const { createQuestionnaireSchema, updateQuestionnaireSchema } = require("../validators/questionnaires.validators");
const {
  createQuestionnaire,
  getQuestionnaires,
  deleteQuestionnaire,
  updateQuestionnaire,
  getQuestionnaire,
} = require("../controllers/questionnaires.controller");
const { verifyUser } = require("../middlewares/verifyUserMiddleware");

const questionnaires = () => {
  const router = express.Router();

  router.post("/api/questionnaires/", verifyUser, validator(createQuestionnaireSchema), (req, res, next) => {
    createQuestionnaire(req, res, next);
  });

  router.get("/api/questionnaires/", verifyUser, (req, res, next) => {
    getQuestionnaires(req, res, next);
  });

  router.get("/api/questionnaires/:id", verifyUser, (req, res, next) => {
    getQuestionnaire(req, res, next);
  });

  router.delete("/api/questionnaires/:id", verifyUser, (req, res, next) => {
    deleteQuestionnaire(req, res, next);
  });

  router.put("/api/questionnaires/:id", verifyUser, validator(updateQuestionnaireSchema), (req, res, next) => {
    updateQuestionnaire(req, res, next);
  });

  return router;
};

module.exports = questionnaires;
