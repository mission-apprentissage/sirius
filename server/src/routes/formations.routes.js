const express = require("express");
const validator = require("../middlewares/validatorMiddleware");
const { createFormationSchema, updateFormationSchema } = require("../validators/formations.validators");
const {
  createFormation,
  getFormations,
  getFormation,
  deleteFormation,
  updateFormation,
} = require("../controllers/formations.controller");
const { verifyUser } = require("../middlewares/verifyUserMiddleware");

const formations = () => {
  const router = express.Router();

  router.post("/api/formations/", verifyUser, validator(createFormationSchema), (req, res, next) => {
    createFormation(req, res, next);
  });

  router.get("/api/formations/", verifyUser, (req, res, next) => {
    getFormations(req, res, next);
  });

  router.get("/api/formations/:id", verifyUser, (req, res, next) => {
    getFormation(req, res, next);
  });

  router.delete("/api/formations/:id", verifyUser, (req, res, next) => {
    deleteFormation(req, res, next);
  });

  router.put("/api/formations/:id", verifyUser, validator(updateFormationSchema), (req, res, next) => {
    updateFormation(req, res, next);
  });

  return router;
};

module.exports = formations;
