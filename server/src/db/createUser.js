const User = require("../models/user.model");

module.exports = async (username, password, firstName, lastName) => {
  try {
    const newUser = await User.register(new User({ username: username.toLowerCase(), firstName, lastName }), password);
    console.log(newUser);
  } catch (err) {
    console.log(err);
  }
};
