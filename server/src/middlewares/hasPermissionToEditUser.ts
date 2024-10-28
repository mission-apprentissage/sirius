import { USER_ROLES, USER_STATUS } from "../constants";
import { UnauthorizedError } from "../errors";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const hasPermissionToEditUser = (req: any, res: any, next: any) => {
  const userIdToEdit = req.params.id;
  const currentUserId = req.user.id;
  const currentUserStatus = req.user.status;
  const currentUserRole = req.user.role;

  if (currentUserRole === USER_ROLES.ADMIN && currentUserStatus === USER_STATUS.ACTIVE) {
    return next();
  }

  if (
    currentUserStatus === USER_STATUS.ACTIVE &&
    userIdToEdit === currentUserId.toString() &&
    !req.body.status &&
    !req.body.role
  ) {
    return next();
  }

  return next(new UnauthorizedError());
};
