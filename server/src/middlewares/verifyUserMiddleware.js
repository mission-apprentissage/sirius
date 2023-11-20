const passport = require("passport");
const { UnauthorizedError, UnconfirmedEmail } = require("../errors");
const { USER_STATUS } = require("../constants");

const STRATEGIES = {
  local: "local",
  jwt: "jwt",
};

const passportCallback = (req, res, next) => {
  return (error, user) => {
    if (user && user.emailConfirmed === false) {
      return next(new UnconfirmedEmail());
    }
    if (error || !user || (req.url !== "/api/users/login" && user.status === USER_STATUS.INACTIVE)) {
      return next(new UnauthorizedError());
    }

    req.user = user;
    next();
  };
};

const verifyUser = (req, res, next) => {
  const callback = passportCallback(req, res, next);
  const strategy = req.url === "/api/users/login" ? STRATEGIES.local : STRATEGIES.jwt;
  return passport.authenticate(strategy, callback, { session: false })(req, res, next);
};

module.exports = { verifyUser, STRATEGIES, passportCallback };
