const express = require("express");
const {
  getVerbatims,
  patchVerbatim,
  patchMultiVerbatim,
  getVerbatimsCount,
} = require("../controllers/verbatims.controller");
const { verifyUser } = require("../middlewares/verifyUserMiddleware");
const { isAdmin } = require("../middlewares/isAdmin");
const validator = require("../middlewares/validatorMiddleware");
const { patchMultiVerbatims } = require("../validators/verbatims.validators");

const verbatims = () => {
  const router = express.Router();

  router.get("/api/verbatims/count", verifyUser, isAdmin, (req, res, next) => {
    getVerbatimsCount(req, res, next);
  });

  router.get("/api/verbatims/", verifyUser, isAdmin, (req, res, next) => {
    getVerbatims(req, res, next);
  });

  router.patch("/api/verbatims/multi", verifyUser, isAdmin, validator(patchMultiVerbatims), (req, res, next) => {
    patchMultiVerbatim(req, res, next);
  });

  router.patch("/api/verbatims/:id", verifyUser, isAdmin, (req, res, next) => {
    patchVerbatim(req, res, next);
  });

  return router;
};

module.exports = verbatims;
