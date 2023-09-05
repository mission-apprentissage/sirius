const { program: cli } = require("commander");
const runScript = require("../modules/runScript");
const createUser = require("./createUser");

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

cli.parse(process.argv);
