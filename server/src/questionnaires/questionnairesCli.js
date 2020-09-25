const { oleoduc } = require("oleoduc");
const { program: cli } = require("commander");
const { createWriteStream } = require("fs");
const runScript = require("../core/runScript");
const sendQuestionnaires = require("./emails/sendQuestionnaires");
const resendQuestionnaires = require("./emails/resendQuestionnaires");
const { encodeIntoUTF8, transformObjectIntoCSV } = require("../core/streamUtils");
const questionnairesStream = require("./streams/questionnairesStream");

cli
  .command("send")
  .option("--limit <number>", "Nombre maximum d'emails envoyés", parseInt)
  .option("--type <string>", "Le type de questionnaire à envoyer")
  .description("Envoie les questionnaires aux apprentis")
  .action((options) => {
    runScript(({ db, logger, questionnaires }) => {
      return sendQuestionnaires(db, logger, questionnaires, { limit: options.limit, type: options.type });
    });
  });

cli
  .command("resend")
  .option("--limit <number>", "Nombre maximum d'emails envoyés", parseInt)
  .description("Renvoie les emails aux apprentis qui n'ont pas répondu au questionnaire")
  .action((options) => {
    runScript(({ db, logger, questionnaires }) => {
      return resendQuestionnaires(db, logger, questionnaires, { limit: options.limit });
    });
  });

cli
  .command("export [outputFile]")
  .description("Exporte toutes les données du questionnaire")
  .action((outputFile = "questionnaires.csv") => {
    runScript(({ db, logger }) => {
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
    });
  });

cli.parse(process.argv);
