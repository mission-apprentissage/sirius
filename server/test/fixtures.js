const { faker } = require("@faker-js/faker");
const moment = require("moment");
const _ = require("lodash");
const ObjectId = require("mongoose").mongo.ObjectId;
const { STRATEGIES } = require("../src/middlewares/verifyUserMiddleware");

faker.locale = "fr";

const newCampagne = (custom = {}, hasId = false) => {
  return _.merge(
    {
      ...(hasId && { _id: ObjectId(faker.database.mongodbObjectId()) }),
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

const newTemoignage = (custom = {}, hasId = false) => {
  return _.merge(
    {
      ...(hasId && { _id: ObjectId(faker.database.mongodbObjectId()) }),
      campagneId: faker.database.mongodbObjectId(),
      reponses: {
        test: faker.lorem.paragraph(),
      },
    },
    custom
  );
};

const newUser = (custom = {}, hasId = false) => {
  return _.merge(
    {
      ...(hasId && { _id: ObjectId(faker.database.mongodbObjectId()) }),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      username: faker.internet.email(),
      authStrategy: STRATEGIES.local,
      refreshToken: [{ _id: ObjectId(faker.database.mongodbObjectId()), refreshToken: "refreshToken" }],
    },
    custom
  );
};

module.exports = {
  newCampagne,
  newTemoignage,
  newUser,
};
