const express = require("express");
const passport = require("passport");
const validator = require("../core/http/validatorMiddleware");
const verifyUser = require("../core/http/verifyUserMiddleware");
const loginSchema = require("../validators/users.validators");
const { loginUser, refreshTokenUser, getCurrentUser, logoutUser } = require("../controllers/users.controller");

const temoignages = () => {
  const router = express.Router();

  router.post(
    "/api/users/login/",
    validator(loginSchema),
    passport.authenticate("local", { session: false }),
    (req, res, next) => loginUser(req, res, next)
  );

  router.post("/api/users/refreshToken/", (req, res, next) => refreshTokenUser(req, res, next));

  router.get("/api/users/me/", verifyUser, (req, res, next) => getCurrentUser(req, res, next));

  router.get("/api/users/logout/", verifyUser, (req, res, next) => logoutUser(req, res, next));

  return router;
};

module.exports = temoignages;
