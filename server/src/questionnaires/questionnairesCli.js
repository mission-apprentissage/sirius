const { program: cli } = require("commander");
const runScript = require("../core/runScript");
const sendQuestionnaires = require("./emails/sendQuestionnaires");
const resendQuestionnaires = require("./emails/resendQuestionnaires");

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

cli.parse(process.argv);
