const csv = require("csv-parser");
const { oleoduc, writeObject } = require("oleoduc");
const validateContrat = require("./validateContrat");
const buildContrat = require("./buildContrat");

module.exports = async (db, logger, inputStream) => {
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
          await validateContrat(contrat);

          await db.collection("contrats").insertOne(contrat);

          stats.imported++;
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
