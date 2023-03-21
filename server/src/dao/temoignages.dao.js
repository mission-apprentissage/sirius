const Temoignage = require("../models/temoignage.model");

const create = async (temoignage) => {
  return Temoignage.create(temoignage);
};

const getAll = async () => {
  return Temoignage.find({}).lean();
};

module.exports = {
  create,
  getAll,
};
