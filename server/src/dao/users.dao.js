const User = require("../models/user.model");

const getOne = (id) => {
  return User.findById(id).lean();
};

const update = (id, user) => {
  return User.updateOne({ _id: id }, user);
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
};
