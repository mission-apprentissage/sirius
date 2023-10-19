const User = require("../models/user.model");

const getOne = (id) => {
  return User.findById(id).lean();
};

const getOneByEmail = (email) => {
  return User.findOne({ email: email }).select("-refreshToken -authStrategy").lean();
};

const update = (id, user) => {
  return User.updateOne({ _id: id, deletedAt: null }, user);
};

const create = ({ email, firstName, lastName, password, comment, etablissements }) => {
  return User.register(
    new User({ email: email.toLowerCase(), firstName, lastName, comment, etablissements }),
    password
  );
};

const getAll = () => {
  return User.find().select("-refreshToken -authStrategy").lean();
};

module.exports = {
  getOne,
  update,
  create,
  getAll,
  getOneByEmail,
};
