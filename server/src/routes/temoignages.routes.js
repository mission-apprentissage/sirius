const express = require("express");
const validator = require("../middlewares/validatorMiddleware");
const { createTemoignageSchema, updateTemoignageSchema } = require("../validators/temoignages.validators");
const {
  createTemoignage,
  getTemoignages,
  deleteTemoignage,
  updateTemoignage,
} = require("../controllers/temoignages.controller");
const { verifyUser } = require("../middlewares/verifyUserMiddleware");

const temoignages = () => {
  const router = express.Router();

  router.post("/api/temoignages/", validator(createTemoignageSchema), (req, res, next) => {
    createTemoignage(req, res, next);
  });

  router.get("/api/temoignages/", verifyUser, (req, res, next) => {
    getTemoignages(req, res, next);
  });

  router.delete("/api/temoignages/:id", verifyUser, (req, res, next) => {
    deleteTemoignage(req, res, next);
  });

  router.put("/api/temoignages/:id", validator(updateTemoignageSchema), (req, res, next) => {
    updateTemoignage(req, res, next);
  });

  return router;
};

module.exports = temoignages;
