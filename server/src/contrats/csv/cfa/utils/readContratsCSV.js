const csv = require("csv-parser");
const { oleoduc, writeObject } = require("oleoduc");
const buildContrat = require("./buildContrat");

module.exports = async (logger, inputStream, callback) => {
  let stats = {
    total: 0,
    imported: 0,
    failed: 0,
  };

  await oleoduc(
    inputStream,
    csv({
      separator: "|",
      mapHeaders: ({ header }) =>
        header
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/ /g, "_"),
    }),
    writeObject(
      async (data) => {
        try {
          stats.total++;

          let contrat = buildContrat(data);
          let nbImported = await callback(contrat);

          stats.imported += nbImported;
        } catch (e) {
          logger.error(`Unable to import ${JSON.stringify(data, null, 2)}`, e);
          stats.failed++;
        }
      },
      { parallel: 10 }
    )
  );

  return stats;
};
