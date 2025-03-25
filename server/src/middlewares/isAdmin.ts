import type { NextFunction, Request, Response } from "express";

import { USER_ROLES, USER_STATUS } from "../constants";
import { UnauthorizedError } from "../errors";
import type { AuthedRequest } from "../types";

export const isAdmin = async (req: Request, _res: Response, next: NextFunction) => {
  const authReq = req as AuthedRequest;
  const { status, role } = authReq.user;

  if (role === USER_ROLES.ADMIN && status === USER_STATUS.ACTIVE) {
    return next();
  }

  return next(new UnauthorizedError());
};
