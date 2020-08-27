const _ = require("lodash");
const { newContrat } = require("../../../test/integration/utils/fixtures");
// eslint-disable-next-line node/no-unpublished-require
const faker = require("faker");
faker.locale = "fr";

module.exports = async (db) => {
  let nbApprentis = 10;

  await Promise.all(
    _.range(0, nbApprentis).map(() => {
      return db.collection("contrats").insertOne(newContrat());
    })
  );
  return { inserted: nbApprentis };
};
