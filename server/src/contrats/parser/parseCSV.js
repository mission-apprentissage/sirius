const csv = require("csv-parser");
const { oleoduc, writeData } = require("oleoduc");
const buildApprenti = require("./buildApprenti");
const buildContrat = require("./buildContrat");
const validateContrat = require("./validateContrat");
const validateApprenti = require("./validateApprenti");

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
    writeData(async (data) => {
      try {
        let contrat = buildContrat(data);
        validateContrat(contrat);

        let apprenti = buildApprenti(data);
        validateApprenti(apprenti);

        return callback(null, { apprenti, contrat });
      } catch (e) {
        return callback(e, data);
      }
    })
  );
};
