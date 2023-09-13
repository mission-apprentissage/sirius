const { UnauthorizedError } = require("../errors");
const { USER_ROLES, USER_STATUS } = require("../constants");

const isAdmin = async (req, res, next) => {
  const { status, role } = req.user;

  if (role === USER_ROLES.ADMIN && status === USER_STATUS.ACTIVE) {
    return next();
  }

  return next(new UnauthorizedError());
};

module.exports = { isAdmin };
