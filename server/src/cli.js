const { program: cli } = require("commander");
const httpServer = require("./core/http/httpServer");
const createComponents = require("./components");

process.on("unhandledRejection", (e) => console.log("An unexpected error occurred", e));
process.on("uncaughtException", (e) => console.log("An unexpected error occurred", e));

cli
  .command("http")
  .description("Démarre le server http")
  .action(async () => {
    let components = await createComponents();

    let server = await httpServer(components);
    server.listen(5000, () => components.logger.info(`Server ready and listening on port ${5000}`));
  });

cli.command("db", "Manipulation de la base de données", { executableFile: "db/dbCli" });
cli.command("deca", "Gestion du DECA", { executableFile: "deca/decaCli" });
cli.command("apprentis", "Gestion des apprentis", { executableFile: "apprentis/apprentisCli" });
cli.command("questionnaires", "Gestion des questionnaires", {
  executableFile: "questionnaires/questionnairesCli",
});
cli.command("misc", "Commandes diverses", { executableFile: "misc/miscCli" });

cli.parse(process.argv);
