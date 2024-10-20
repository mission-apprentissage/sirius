import { USER_ROLES, USER_STATUS } from "../constants";
import { UnauthorizedError } from "../errors";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const isAdmin = async (req: any, res: any, next: any) => {
  const { status, role } = req.user;

  if (role === USER_ROLES.ADMIN && status === USER_STATUS.ACTIVE) {
    return next();
  }

  return next(new UnauthorizedError());
};
