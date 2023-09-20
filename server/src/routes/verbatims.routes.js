const express = require("express");
const { getVerbatims } = require("../controllers/verbatims.controller");
const { verifyUser } = require("../middlewares/verifyUserMiddleware");
const { isAdmin } = require("../middlewares/isAdmin");

const verbatims = () => {
  const router = express.Router();

  router.get("/api/verbatims/", verifyUser, isAdmin, (req, res, next) => {
    getVerbatims(req, res, next);
  });

  return router;
};

module.exports = verbatims;
