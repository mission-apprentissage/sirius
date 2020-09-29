const moment = require("moment");
const parseCSV = require("./parser/parseCSV");

module.exports = async (logger, apprentis, csvStream) => {
  let stats = {
    total: 0,
    created: 0,
    ignored: 0,
    updated: 0,
    invalid: 0,
  };

  await parseCSV(csvStream, async (err, data) => {
    stats.total++;
    if (err) {
      logger.error(`Unable to import ${JSON.stringify(data, null, 2)}`, err);
      stats.invalid++;
    } else {
      let { apprenti, contrat } = data;
      let email = apprenti.email;

      if (await apprentis.exists(email)) {
        if (await apprentis.hasContrat(email, contrat)) {
          stats.ignored++;
        } else {
          await apprentis.addContrat(email, contrat);
          stats.updated++;
        }
      } else {
        await apprentis.create({
          creationDate: new Date(),
          cohorte: `cohorte_test_${moment().format("YYYY_MM_DD")}`,
          unsubscribe: false,
          contrats: [contrat],
          ...apprenti,
        });
        stats.created++;
      }
    }
  });

  return stats;
};
