const express = require("express");
const { getVerbatims, patchVerbatim } = require("../controllers/verbatims.controller");
const { verifyUser } = require("../middlewares/verifyUserMiddleware");
const { isAdmin } = require("../middlewares/isAdmin");

const verbatims = () => {
  const router = express.Router();

  router.get("/api/verbatims/", verifyUser, isAdmin, (req, res, next) => {
    getVerbatims(req, res, next);
  });

  router.patch("/api/verbatims/:id", verifyUser, isAdmin, (req, res, next) => {
    patchVerbatim(req, res, next);
  });

  return router;
};

module.exports = verbatims;
