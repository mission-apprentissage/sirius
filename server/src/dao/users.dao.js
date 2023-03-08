const User = require("../models/user.model");

const getOne = (id) => {
  return User.findById(id).lean();
};

const update = (id, user) => {
  return User.replaceOne({ _id: id }, user);
};

const create = (user) => {
  return User.create(user);
};

module.exports = {
  getOne,
  update,
  create,
};
