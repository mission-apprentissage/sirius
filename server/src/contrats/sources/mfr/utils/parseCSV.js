const csv = require("csv-parser");
const { oleoduc, writeObject } = require("oleoduc");
const buildContrat = require("./buildContrat");
const validateContrat = require("./validateContrat");

module.exports = (inputStream, callback) => {
  return oleoduc(
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
    writeObject(async (data) => {
      let contrat = null;
      try {
        contrat = buildContrat(data);
        validateContrat(contrat);
        return callback(null, contrat);
      } catch (e) {
        return callback(e, data);
      }
    })
  );
};
