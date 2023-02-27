const { program: cli } = require("commander");
const runScript = require("../modules/runScript");
const migrateDb = require("./migrateDb");
const injectData = require("./injectData");
const createUser = require("./createUser");

cli
  .command("migrate")
  .description("Migre les données en base")
  .action(() => {
    runScript(({ db }) => migrateDb(db));
  });

cli
  .command("dataset")
  .description("Injecte un jeu de données dans la base")
  .action(() => {
    runScript(({ db, apprentis }) => injectData(db, apprentis));
  });

cli
  .command("create-user")
  .argument("<username>", "Email de l'utilisateur")
  .argument("<password>", "Mot de passe de l'utilisateur")
  .argument("<firstName>", "Prénom de l'utilisateur")
  .argument("<lastName>", "Nom de l'utilisateur")
  .description("Créer un nouvel utilisateur")
  .action((username, password, firstName, lastName) => {
    runScript(() => createUser(username, password, firstName, lastName));
  });

cli.parse(process.argv);
