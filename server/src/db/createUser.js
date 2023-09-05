const User = require("../models/user.model");

module.exports = async (email, password, firstName, lastName) => {
  try {
    return User.register(new User({ email: email.toLowerCase(), firstName, lastName }), password);
  } catch (err) {
    console.log(err);
  }
};
