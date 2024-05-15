const express = require("express");
const {
  getVerbatims,
  patchVerbatims,
  getVerbatimsCount,
  createVerbatim,
} = require("../controllers/verbatims.controller");
const { verifyUser } = require("../middlewares/verifyUserMiddleware");
const { isAdmin } = require("../middlewares/isAdmin");
const validator = require("../middlewares/validatorMiddleware");
const { patchMultiVerbatims } = require("../validators/verbatims.validators");

const verbatims = () => {
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

module.exports = verbatims;
