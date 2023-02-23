const express = require("express");
const passport = require("passport");
const tryCatch = require("../core/http/tryCatchMiddleware");
const validator = require("../core/http/validatorMiddleware");
const { BasicError } = require("../core/errors");
const { COOKIE_OPTIONS, getToken, getRefreshToken } = require("../core/utils/authenticateUtils");
const loginSchema = require("./validators");

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

  return router;
};

module.exports = usersHttp;
