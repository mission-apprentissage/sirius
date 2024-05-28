const { program: cli } = require("commander");
const runScript = require("../modules/runScript");
const createUser = require("./createUser");
const migrateVerbatims = require("./migrateVerbatims");
const classifyVerbatims = require("./classifyVerbatims");
const extractThemesVerbatims = require("./extractThemesVerbatims");

cli
  .command("create-user")
  .argument("<email>", "Email de l'utilisateur")
  .argument("<password>", "Mot de passe de l'utilisateur")
  .argument("<firstName>", "Prénom de l'utilisateur")
  .argument("<lastName>", "Nom de l'utilisateur")
  .description("Créer un nouvel utilisateur")
  .action((email, password, firstName, lastName) => {
    runScript(() => createUser(email, password, firstName, lastName));
  });

cli
  .command("migrate-verbatims")
  .argument("[isDryRun]", "Booléen pour simuler la migration des verbatims")
  .description("Migrer les verbatims")
  .action((isDryRun) => {
    runScript(() => migrateVerbatims({ isDryRun: isDryRun === "true" }));
  });

cli
  .command("classify-verbatims")
  .description("Classifie les verbatims exitants")
  .action(() => {
    runScript(() => classifyVerbatims());
  });

cli
  .command("extract-themes-verbatims")
  .description("Extrait les thèmes des verbatims exitants")
  .action(() => {
    runScript(() => extractThemesVerbatims());
  });

cli.parse(process.argv);
