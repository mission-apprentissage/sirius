const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const tryCatch = require("../core/http/tryCatchMiddleware");
const validator = require("../core/http/validatorMiddleware");
const { BasicError, Unauthorized } = require("../core/errors");
const { COOKIE_OPTIONS, getToken, getRefreshToken } = require("../core/utils/authenticateUtils");
const loginSchema = require("./validators");
const config = require("../config");
const verifyUser = require("../core/http/verifyUserMiddleware");

const usersHttp = ({ usersController }) => {
  const router = express.Router();

  router.post(
    "/api/users/login/",
    validator(loginSchema),
    passport.authenticate("local", { session: false }),
    tryCatch(async (req, res) => {
      const token = getToken({ _id: req.user._id });
      const refreshToken = getRefreshToken({ _id: req.user._id });

      const user = await usersController.getOne(req.user._id);

      user.refreshToken.push({ refreshToken });

      const updatedUser = await usersController.update(user);

      if (updatedUser._id) {
        res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
        res.json({ success: true, token });
      } else {
        throw new BasicError();
      }
    })
  );

  router.post(
    "/api/users/refreshToken/",
    tryCatch(async (req, res) => {
      const { signedCookies = {} } = req;
      const { refreshToken } = signedCookies;

      if (!refreshToken) {
        throw new Unauthorized();
      }

      const payload = jwt.verify(refreshToken, config.auth.refreshTokenSecret);

      if (!payload) {
        throw new Unauthorized();
      }

      const userId = payload._id;

      const user = await usersController.getOne(userId);

      if (!user) {
        throw new Unauthorized();
      }

      const tokenIndex = user.refreshToken.findIndex((item) => item.refreshToken === refreshToken);

      if (tokenIndex === -1) {
        throw new Unauthorized();
      }

      const token = getToken({ _id: userId });
      const newRefreshToken = getRefreshToken({ _id: userId });
      user.refreshToken[tokenIndex] = { refreshToken: newRefreshToken };

      const updatedUser = await usersController.update(user);

      if (!updatedUser._id) {
        throw new BasicError();
      }

      res.cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS);
      res.json({ success: true, token });
    })
  );

  router.get("/api/users/me", verifyUser, (req, res) => {
    res.json(req.user);
  });

  router.get(
    "/api/users/logout",
    verifyUser,
    tryCatch(async (req, res) => {
      const { signedCookies = {} } = req;
      const { refreshToken } = signedCookies;

      if (!refreshToken) {
        throw new Unauthorized();
      }

      const user = await usersController.getOne(req.user._id);

      if (!user) {
        throw new BasicError();
      }

      const tokenIndex = user.refreshToken.findIndex((item) => item.refreshToken === refreshToken);

      if (tokenIndex === -1) {
        throw new Unauthorized();
      }

      user.refreshToken.id(user.refreshToken[tokenIndex]._id).remove();

      const updatedUser = await usersController.update(user);

      if (!updatedUser._id) {
        throw new BasicError();
      }

      res.clearCookie("refreshToken", COOKIE_OPTIONS);
      res.send({ success: true });
    })
  );

  return router;
};

module.exports = usersHttp;
