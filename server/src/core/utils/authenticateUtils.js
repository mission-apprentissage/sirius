const passport = require("passport");
const jwt = require("jsonwebtoken");
const config = require("../../config");

const isDev = config.env === "dev";

const { refreshTokenExpiry, sessionExpiry, jwtSecret, refreshTokenSecret } = config.auth;

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: !isDev,
  signed: true,
  maxAge: refreshTokenExpiry * 1000,
  sameSite: "none",
};

const getToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    expiresIn: sessionExpiry,
  });
};

const getRefreshToken = (user) => {
  const refreshToken = jwt.sign(user, refreshTokenSecret, {
    expiresIn: refreshTokenExpiry,
  });
  return refreshToken;
};

const verifyUser = passport.authenticate("jwt", { session: false });

module.exports = { COOKIE_OPTIONS, getToken, getRefreshToken, verifyUser };
