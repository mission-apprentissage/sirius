const passport = require("passport");
const { BasicStrategy } = require("passport-http");

module.exports = (config) => {
  passport.use(
    new BasicStrategy(function (username, password, done) {
      if (config.auth[username] === password) {
        return done(null, { user: 1 });
      }
      return done(null, false);
    })
  );

  return passport.authenticate("basic", { session: false });
};
