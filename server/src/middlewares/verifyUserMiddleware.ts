// @ts-nocheck -- TODO

import passport from "passport";

import { USER_STATUS } from "../constants";
import { UnauthorizedError, UnconfirmedEmail } from "../errors";

export const STRATEGIES = {
  local: "local",
  jwt: "jwt",
};

export const passportCallback = (req, _res, next) => {
  return (error, user) => {
    if (user && user.emailConfirmed === false && req.url !== "/api/users/logout") {
      return next(new UnconfirmedEmail());
    }
    if (error || !user || (req.url !== "/api/users/login" && user.status === USER_STATUS.INACTIVE)) {
      return next(new UnauthorizedError());
    }

    req.user = user;
    next();
  };
};

export const verifyUser = (req, res, next) => {
  const callback = passportCallback(req, res, next);
  const strategy = req.url === "/api/users/login" ? STRATEGIES.local : STRATEGIES.jwt;
  return passport.authenticate(strategy, callback, { session: false })(req, res, next);
};
