const { UnauthorizedError } = require("../errors");
const { USER_ROLES, USER_STATUS } = require("../constants");

const hasPermissionToEditUser = (req, res, next) => {
  const userIdToEdit = req.params.id;
  const currentUserId = req.user._id;
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

module.exports = { hasPermissionToEditUser };
