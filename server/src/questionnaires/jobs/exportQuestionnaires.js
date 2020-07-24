const env = require("env-var");
const path = require("path");
const { createWriteStream } = require("fs");
const { oleoduc } = require("oleoduc");
const { encodeIntoUTF8 } = require("../../core/streamUtils");
const questionnairesCSVStream = require("../questionnairesCSVStream");
const runScript = require("../../core/runScript");

runScript(async ({ db, logger }) => {
  const csvFile = env
    .get("OUTPUT")
    .default(path.join(__dirname, "../../../../.local", `questionnaires.csv`))
    .asString();

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
});
