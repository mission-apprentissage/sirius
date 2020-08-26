const readContratsCSV = require("./readContratsCSV");

module.exports = async (db, logger, csvStream) => {
  return readContratsCSV(csvStream, async (err, data) => {
    if (err) {
      logger.error(`Unable to import ${JSON.stringify(data, null, 2)}`, err);
    } else {
      await db.collection("contrats").insertOne(data);
    }
  });
};
