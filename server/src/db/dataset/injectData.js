const _ = require("lodash");
const { newContrat } = require("../../../test/integration/utils/fixtures");
const moment = require("moment");
// eslint-disable-next-line node/no-unpublished-require
const faker = require("faker");
faker.locale = "fr";

module.exports = async (db, questionnaires) => {
  let nbApprentis = 10;
  let nbFinAnnee = nbApprentis / 2;
  let nbFinFormation = nbApprentis / 2;

  await Promise.all(
    _.range(0, nbFinAnnee).map(() => {
      return db.collection("contrats").insertOne(
        newContrat({
          formation: {
            periode: {
              debut: moment().subtract(1, "years").toDate(),
              fin: moment().add(2, "years").toDate(),
            },
          },
        })
      );
    })
  );

  await Promise.all(
    _.range(0, nbFinFormation).map(async () => {
      let contrat = newContrat({
        formation: {
          periode: {
            debut: moment().subtract(2, "years").toDate(),
            fin: moment().subtract(1, "days").toDate(),
          },
        },
      });

      await db.collection("contrats").insertOne(contrat);
      await questionnaires.create(contrat, "finAnnee");
    })
  );
  return {
    apprentis: {
      finAnnee: nbFinAnnee,
      finFormation: nbFinFormation,
    },
  };
};
