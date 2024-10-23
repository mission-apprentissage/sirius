import jwt from "jsonwebtoken";

import config from "../config";

const isDev = config.env === "local";

const { refreshTokenExpiry, sessionExpiry, jwtSecret, refreshTokenSecret } = config.auth;

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: !isDev,
  signed: true,
  maxAge: refreshTokenExpiry * 1000,
  sameSite: "strict",
};

export const getToken = (user: any) => {
  return jwt.sign(user, jwtSecret, {
    expiresIn: sessionExpiry,
  });
};

export const getRefreshToken = (user: any) => {
  const refreshToken = jwt.sign(user, refreshTokenSecret, {
    expiresIn: refreshTokenExpiry,
  });
  return refreshToken;
};
