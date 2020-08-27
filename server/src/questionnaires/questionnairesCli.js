const { program: cli } = require("commander");
const runScript = require("../core/runScript");
const sendQuestionnaires = require("./emails/sendQuestionnaires");
const resendQuestionnaires = require("./emails/resendQuestionnaires");
const exportQuestionnaires = require("./export/exportQuestionnaires");

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
  .description("Export les questionnaires")
  .action((outputFile) => {
    runScript(({ db, logger }) => exportQuestionnaires(db, logger, outputFile));
  });

cli.parse(process.argv);
