const passport = require("passport");
const { BasicStrategy } = require("passport-http");

module.exports = (config) => {
  passport.use(
    new BasicStrategy(function (email, password, done) {
      if (config.auth[email] === password) {
        return done(null, { user: 1 });
      }
      return done(null, false);
    })
  );

  return passport.authenticate("basic", { session: false });
};
