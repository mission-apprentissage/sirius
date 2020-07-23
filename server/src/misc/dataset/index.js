// eslint-disable-next-line node/no-unpublished-require
const faker = require("faker");
const _ = require("lodash");
const runScript = require("../../core/runScript");
const { newContrat } = require("../../../test/integration/utils/fixtures");

faker.locale = "fr";

runScript(async ({ db }) => {
  let nbApprentis = 10;

  await db.collection("contrats").removeMany({});
  await Promise.all(
    _.range(0, nbApprentis).map(() => {
      return db.collection("contrats").insertOne(newContrat());
    })
  );
  return { inserted: nbApprentis };
});
