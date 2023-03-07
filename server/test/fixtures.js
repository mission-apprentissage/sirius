const faker = require("@faker-js/faker"); // eslint-disable-line node/no-unpublished-require
const moment = require("moment");
const _ = require("lodash");

faker.locale = "fr";

const newCampagne = (custom = {}) => {
  return _.merge(
    {
      nomCampagne: "nom de la campagne",
      cfa: "cfa1",
      formation: "formation1",
      startDate: moment(new Date()).format("YYYY-MM-DD"),
      endDate: moment(new Date()).format("YYYY-MM-DD"),
      questionnaire: {},
      questionnaireUI: {},
    },
    custom
  );
};

const newTemoignage = (custom = {}) => {
  return _.merge(
    {
      campagneId: "5f9f1b9b9c9d4b0b8c8b8b8b",
      reponses: {
        test: faker.lorem.paragraph(),
      },
    },
    custom
  );
};

module.exports = {
  newCampagne,
  newTemoignage,
};
