const { program: cli } = require("commander");
const runScript = require("../core/runScript");
const sendQuestionnaires = require("./emails/sendQuestionnaires");
const resendQuestionnaires = require("./emails/resendQuestionnaires");
const exportQuestionnairesWithApprentis = require("./export/exportQuestionnairesWithApprentis");

cli
  .command("send")
  .option("--limit <number>", "Nombre maximum d'emails envoyés", parseInt)
  .description("Envoie les questionnaires aux apprentis")
  .action((options) => {
    runScript(({ db, logger, questionnaires }) => {
      return sendQuestionnaires(db, logger, questionnaires, { limit: options.limit });
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
    runScript(({ db, logger }) => exportQuestionnairesWithApprentis(db, logger, outputFile));
  });

cli.parse(process.argv);
