const moment = require("moment");
const parseCSV = require("./utils/parseCSV");

module.exports = async (db, logger, csvStream) => {
  let stats = {
    total: 0,
    imported: 0,
    ignored: 0,
    invalid: 0,
  };

  await parseCSV(csvStream, async (err, contrat) => {
    stats.total++;
    if (err) {
      logger.error(`Unable to import ${JSON.stringify(contrat, null, 2)}`, err);
      stats.invalid++;
    } else {
      let notExists =
        (await db.collection("contrats").countDocuments({ "apprenti.email": contrat.apprenti.email })) === 0;
      if (notExists) {
        await db.collection("contrats").insertOne({
          creationDate: new Date(),
          cohorte: `cohorte_test_${moment().format("YYYY_MM_DD")}`,
          questionnaires: [],
          unsubscribe: false,
          ...contrat,
        });
        stats.imported++;
      } else {
        stats.ignored++;
      }
    }
  });

  return stats;
};
