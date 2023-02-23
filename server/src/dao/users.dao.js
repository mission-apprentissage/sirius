const User = require("../models/user.model");

const getOne = (id) => {
  return User.findById(id);
};

const update = (user) => {
  return user.save();
};

module.exports = {
  getOne,
  update,
};
