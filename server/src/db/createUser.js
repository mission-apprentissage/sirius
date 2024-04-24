const User = require("../models/user.model");

module.exports = async (email, password, firstName, lastName, role, comment, etablissements) => {
  try {
    return User.register(
      new User({ email: email.toLowerCase(), firstName, lastName, role, comment, etablissements }),
      password
    );
  } catch (err) {
    console.log(err);
  }
};
