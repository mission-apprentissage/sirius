const { program: cli } = require("commander");
const runScript = require("../modules/runScript");
const createUser = require("./createUser");

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
