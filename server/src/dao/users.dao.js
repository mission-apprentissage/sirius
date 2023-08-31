const User = require("../models/user.model");

const getOne = (id) => {
  return User.findById(id).lean();
};

const getOneByEmail = (email) => {
  return User.findOne({ username: email }).select("-refreshToken -authStrategy").lean();
};

const update = (id, user) => {
  return User.updateOne({ _id: id, deletedAt: null }, user);
};

const create = ({ username, firstName, lastName, password, comment, etablissement, siret }) => {
  return User.register(
    new User({ username: username.toLowerCase(), firstName, lastName, comment, etablissement, siret }),
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
