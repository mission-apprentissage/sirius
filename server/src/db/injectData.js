const _ = require("lodash");
const { newApprenti } = require("../../test/integration/utils/fixtures");
const moment = require("moment");
const faker = require("@faker-js/faker"); //eslint-disable-line node/no-unpublished-require
faker.locale = "fr";

module.exports = async (db) => {
  let nbApprentis = 10;
  let nbFinAnnee = nbApprentis / 2;
  let nbFinFormation = nbApprentis / 2;

  await Promise.all(
    _.range(0, nbFinAnnee).map(() => {
      return db.collection("apprentis").insertOne(
        newApprenti({
          contrats: [
            {
              formation: {
                periode: {
                  debut: moment().subtract(1, "years").subtract(1, "days").toDate(),
                  fin: moment().add(2, "years").toDate(),
                },
              },
            },
          ],
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
    })
  );
  return {
    apprentis: {
      finAnnee: nbFinAnnee,
      finFormation: nbFinFormation,
    },
  };
};
