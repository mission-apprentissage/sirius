const _ = require("lodash");
const { newApprenti } = require("../../../test/integration/utils/fixtures");
const moment = require("moment");
// eslint-disable-next-line node/no-unpublished-require
const faker = require("faker");
faker.locale = "fr";

module.exports = async (db, apprentis) => {
  let nbApprentis = 10;
  let nbFinAnnee = nbApprentis / 2;
  let nbFinFormation = nbApprentis / 2;

  await Promise.all(
    _.range(0, nbFinAnnee).map(() => {
      return db.collection("apprentis").insertOne(
        newApprenti({
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
      let apprenti = newApprenti({
        formation: {
          periode: {
            debut: moment().subtract(2, "years").toDate(),
            fin: moment().subtract(1, "days").toDate(),
          },
        },
      });

      await db.collection("apprentis").insertOne(apprenti);
      let context = await apprentis.getNextQuestionnaireContext(apprenti.email);
      await apprentis.generateQuestionnaire(apprenti.email, context);
    })
  );
  return {
    apprentis: {
      finAnnee: nbFinAnnee,
      finFormation: nbFinFormation,
    },
  };
};
