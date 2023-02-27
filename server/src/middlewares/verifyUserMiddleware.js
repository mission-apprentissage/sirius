const passport = require("passport");
const { UnauthorizedError } = require("../errors");

const STRATEGIES = {
  local: "local",
  jwt: "jwt",
};

const passportCallback = (req, res, next) => {
  return (error, user) => {
    if (error || !user) {
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

module.exports = { verifyUser, STRATEGIES };
