const dropIndexes = require("./migration/dropIndexes");
const createIndexes = require("./migration/createIndexes");

module.exports = async (db) => {
  return {
    dropIndexes: await dropIndexes(db),
    createIndexes: await createIndexes(db),
  };
};
