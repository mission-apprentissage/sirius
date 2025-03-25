import type { NextFunction, Request, Response } from "express";

import { USER_ROLES, USER_STATUS } from "../constants";
import { UnauthorizedError } from "../errors";
import type { AuthedRequest } from "../types";

export const hasPermissionToEditUser = (req: Request, _res: Response, next: NextFunction) => {
  const authReq = req as AuthedRequest;
  const userIdToEdit = authReq.params.id;
  const currentUserId = authReq.user.id;
  const currentUserStatus = authReq.user.status;
  const currentUserRole = authReq.user.role;

  if (currentUserRole === USER_ROLES.ADMIN && currentUserStatus === USER_STATUS.ACTIVE) {
    return next();
  }

  if (
    currentUserStatus === USER_STATUS.ACTIVE &&
    userIdToEdit === currentUserId.toString() &&
    !authReq.body.status &&
    !authReq.body.role
  ) {
    return next();
  }

  return next(new UnauthorizedError());
};
