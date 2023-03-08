const faker = require("@faker-js/faker");
const moment = require("moment");
const _ = require("lodash");
const { STRATEGIES } = require("../src/middlewares/verifyUserMiddleware");

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
      campagneId: faker.random.uuid(),
      reponses: {
        test: faker.lorem.paragraph(),
      },
    },
    custom
  );
};

const newUser = (custom = {}) => {
  return _.merge(
    {
      _id: faker.random.uuid(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      username: faker.internet.email(),
      authStrategy: STRATEGIES.local,
      refreshToken: ["aaaaaaaa"],
    },
    custom
  );
};

module.exports = {
  newCampagne,
  newTemoignage,
  newUser,
};
