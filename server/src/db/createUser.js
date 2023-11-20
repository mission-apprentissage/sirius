const User = require("../models/user.model");

module.exports = async (email, password, firstName, lastName, comment, etablissements) => {
  try {
    return User.register(
      new User({ email: email.toLowerCase(), firstName, lastName, comment, etablissements }),
      password
    );
  } catch (err) {
    console.log(err);
  }
};
