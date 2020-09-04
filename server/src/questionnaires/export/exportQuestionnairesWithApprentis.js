const { createWriteStream } = require("fs");
const { oleoduc } = require("oleoduc");
const { encodeIntoUTF8, transformObjectIntoCSV } = require("../../core/streamUtils");
const questionnairesStream = require("../questionnairesStream");

module.exports = (db, logger, outputFile) => {
  logger.info(`Generating CSV file ${outputFile}...`);

  return oleoduc([
    questionnairesStream(db, ({ apprenti }) => {
      return {
        prenom: apprenti.prenom,
        nom: apprenti.nom,
        email: apprenti.email,
        portable: apprenti.telephones.portable,
      };
    }),
    transformObjectIntoCSV(),
    encodeIntoUTF8(),
    createWriteStream(outputFile),
  ]);
};
