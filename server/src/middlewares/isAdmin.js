const { UnauthorizedError } = require("../errors");
const { ROLES, STATUS } = require("../constants");

const isAdmin = async (req, res, next) => {
  const { status, role } = req.user;

  if (role === ROLES.ADMIN && status === STATUS.ACTIVE) {
    return next();
  }

  return next(new UnauthorizedError());
};

module.exports = { isAdmin };
