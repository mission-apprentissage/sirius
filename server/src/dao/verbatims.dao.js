const Verbatim = require("../models/verbatim.model");

const count = (query) => {
  return Verbatim.countDocuments({ ...query, deletedAt: null });
};

const getAll = ({ query }) => {
  return Verbatim.find({ ...query, deletedAt: null });
};

module.exports = {
  count,
  getAll,
};
