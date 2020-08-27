const { createWriteStream } = require("fs");
const { oleoduc } = require("oleoduc");
const { encodeIntoUTF8 } = require("../../core/streamUtils");
const questionnairesCSVStream = require("../questionnairesCSVStream");

module.exports = (db, logger, outputFile) => {
  const csvFile = outputFile || "questionnaires.csv";

  logger.info(`Generating CSV file ${csvFile}...`);
  return oleoduc([
    questionnairesCSVStream(db, {
      prenom: ({ apprenti }) => apprenti.prenom,
      nom: ({ apprenti }) => apprenti.nom,
      email: ({ apprenti }) => apprenti.email,
      portable: ({ apprenti }) => apprenti.telephones.portable,
    }),
    encodeIntoUTF8(),
    createWriteStream(csvFile),
  ]);
};
