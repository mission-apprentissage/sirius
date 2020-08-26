const csv = require("csv-parser");
const { oleoduc, writeObject } = require("oleoduc");
const validateContrat = require("./validateContrat");
const buildContrat = require("./buildContrat");

module.exports = async (inputStream, callback) => {
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

          await callback(null, contrat);

          stats.imported++;
        } catch (e) {
          await callback(e, data);
          stats.failed++;
        }
      },
      { parallel: 10 }
    )
  );

  return stats;
};
