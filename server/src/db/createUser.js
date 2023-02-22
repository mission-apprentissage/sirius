const User = require("../models/user");
const { getToken, getRefreshToken } = require("../core/utils/authenticateUtils");

module.exports = async (username, password, firstName, lastName) => {
  User.register(new User({ username: username }), password, (err, user) => {
    if (err) {
      console.log(err);
    } else {
      user.firstName = firstName;
      user.lastName = lastName || "";

      const token = getToken({ _id: user._id });
      const refreshToken = getRefreshToken({ _id: user._id });

      user.refreshToken.push({ refreshToken });

      user.save((err, user) => {
        if (err) {
          console.log(err);
        } else {
          console.log("User created");
          console.log("User: ", user);
          console.log("Token: ", token);
          console.log("Refresh token: ", refreshToken);
        }
      });
    }
  });
};
