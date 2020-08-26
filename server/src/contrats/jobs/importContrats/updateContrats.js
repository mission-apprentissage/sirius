const readContratsCSV = require("./readContratsCSV");

module.exports = async (db, logger, csvStream) => {
  return readContratsCSV(csvStream, (err, data) => {
    if (err) {
      logger.error(`Unable to update ${JSON.stringify(data, null, 2)}`, err);
    } else {
      return db.collection("contrats").updateOne(
        { "apprenti.email": data.apprenti.email },
        {
          $set: {
            "cfa.nom": data.cfa.nom,
            "cfa.siret": data.cfa.siret,
          },
        }
      );
    }
  });
};
