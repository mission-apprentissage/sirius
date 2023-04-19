const User = require("../models/user.model");

module.exports = async (username, password, firstName, lastName) => {
  try {
    return User.register(new User({ username: username.toLowerCase(), firstName, lastName }), password);
  } catch (err) {
    console.log(err);
  }
};
