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

  let handleError = (err, json) => {
    stats.invalid++;

    let level = err.name === "ValidationError" ? "warn" : "error";
    logger[level](`Unable to update ${JSON.stringify(json, null, 2)}`, err);
  };

  await parseCSV(csvStream, async (err, json) => {
    stats.total++;

    if (err) {
      handleError(err, json);
    } else {
      let email = json.apprenti.email;
      let contrat = {
        ...json.contrat,
        questionnaires: [],
      };

      if (await apprentis.exists(email)) {
        if (await apprentis.hasContrat(email, contrat)) {
          stats.duplicated++;
        } else {
          let previous = await apprentis.getApprenti(email);
          if (moment(previous.creationDate).diff(moment(), "days") === 0) {
            await apprentis.addContrat(email, contrat);
            stats.updated++;
          }
        }
      } else {
        await apprentis.create({
          creationDate: new Date(),
          cohorte: `cohorte_test_${moment().format("YYYY_MM_DD")}`,
          unsubscribe: false,
          ...json.apprenti,
          contrats: [contrat],
        });
        stats.created++;
      }
    }
  });

  return stats;
};
