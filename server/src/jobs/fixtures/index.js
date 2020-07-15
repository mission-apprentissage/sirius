// eslint-disable-next-line node/no-unpublished-require
const faker = require("faker");
const _ = require("lodash");
const runScript = require("../runScript");

faker.locale = "fr";

runScript(async ({ db }) => {
  let nbApprentis = 10;

  await Promise.all(
    _.range(0, nbApprentis).map(() => {
      return db.collection("apprentis").insertOne({
        prenom: faker.name.firstName(),
        nom: faker.name.lastName(),
        email: faker.internet.email(),
        token: faker.random.uuid(),
        formation: {
          intitule: "CAP Boucher à Institut régional de formation des métiers de l'artisanat - IRFMA de l'Aude",
        },
      });
    })
  );
  return { inserted: nbApprentis };
});
