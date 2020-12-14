const moment = require("moment");
const parseCSV = require("./parser/parseCSV");

module.exports = async (logger, apprentis, csvStream) => {
  let stats = {
    total: 0,
    created: 0,
    duplicated: 0,
    updated: 0,
    invalid: 0,
  };

  await parseCSV(csvStream, async (err, data) => {
    stats.total++;
    if (err) {
      let level = err.name === "ValidationError" ? "warn" : "error";
      logger[level](`Unable to import ${JSON.stringify(data, null, 2)}`, err);
      stats.invalid++;
    } else {
      let apprenti = {
        creationDate: new Date(),
        cohorte: `cohorte_test_${moment().format("YYYY_MM_DD")}`,
        unsubscribe: false,
        ...data.apprenti,
      };
      let email = apprenti.email;
      let contrat = {
        ...data.contrat,
        questionnaires: [],
      };

      if (await apprentis.exists(email)) {
        if (await apprentis.hasContrat(email, contrat)) {
          stats.duplicated++;
        } else {
          await apprentis.addContrat(email, contrat);
          stats.updated++;
        }
      } else {
        await apprentis.create({ ...apprenti, contrats: [contrat] });
        stats.created++;
      }
    }
  });

  return stats;
};
