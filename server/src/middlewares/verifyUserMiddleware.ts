import type { NextFunction, Request, Response } from "express";
import passport from "passport";

import { USER_STATUS } from "../constants";
import { UnauthorizedError, UnconfirmedEmail } from "../errors";
import type { User } from "../types";

export const STRATEGIES = {
  local: "local",
  jwt: "jwt",
};

export const passportCallback = (req: Request, _res: Response, next: NextFunction) => {
  return (error: Error | null, user: User | null) => {
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

export const verifyUser = (req: Request, res: Response, next: NextFunction) => {
  const callback = passportCallback(req, res, next);
  const strategy = req.url === "/api/users/login" ? STRATEGIES.local : STRATEGIES.jwt;
  return passport.authenticate(strategy, { session: false }, callback)(req, res, next);
};
