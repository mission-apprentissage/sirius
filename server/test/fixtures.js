const { faker } = require("@faker-js/faker");
const moment = require("moment");
const _ = require("lodash");
const ObjectId = require("mongoose").mongo.ObjectId;
const { STRATEGIES } = require("../src/middlewares/verifyUserMiddleware");
const { USER_ROLES, USER_STATUS } = require("../src/constants");

faker.locale = "fr";

const newCampagne = (custom = {}, hasId = false) => {
  return _.merge(
    {
      ...(hasId && { _id: ObjectId(faker.database.mongodbObjectId()) }),
      nomCampagne: "nom de la campagne",
      startDate: moment(new Date("2022-01-01")).format("YYYY-MM-DD"),
      endDate: moment(new Date("2025-01-01")).format("YYYY-MM-DD"),
      questionnaireId: faker.database.mongodbObjectId(),
      seats: 0,
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
      lastQuestionAt: new Date(),
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
      email: faker.internet.email().toLowerCase(),
      emailConfirmed: false,
      role: USER_ROLES.ETABLISSEMENT,
      status: USER_STATUS.PENDING,
      comment: faker.lorem.paragraph(),
      etablissements: [],
      authStrategy: STRATEGIES.local,
      refreshToken: [{ _id: ObjectId(faker.database.mongodbObjectId()), refreshToken: "refreshToken" }],
    },
    custom
  );
};

const newFormation = (custom = {}, hasId = false) => {
  return _.merge(
    {
      ...(hasId && { _id: ObjectId(faker.database.mongodbObjectId()) }),
      data: {
        intitule_long: faker.lorem.words(),
        tags: ["2020", "2021", "2022"],
        lieu_formation_adresse_computed: faker.address.streetAddress(),
        diplome: faker.lorem.words(),
        localite: faker.address.city(),
        duree: 3,
      },
      campagneId: faker.database.mongodbObjectId(),
      deletedAt: null,
      createdBy: ObjectId(faker.database.mongodbObjectId()),
    },
    custom
  );
};

const newEtablissement = (custom = {}, hasId = false) => {
  return _.merge(
    {
      ...(hasId && { _id: ObjectId(faker.database.mongodbObjectId()) }),
      data: {
        onisep_nom: faker.lorem.words(),
        enseigne: faker.lorem.words(),
        siret: "123456789",
        entreprise_raison_sociale: faker.lorem.words(),
      },
      formationIds: [],
      deletedAt: null,
      createdBy: faker.database.mongodbObjectId(),
    },
    custom
  );
};

const newQuestionnaire = (custom = {}, hasId = false) => {
  return _.merge(
    {
      ...(hasId && { _id: ObjectId(faker.database.mongodbObjectId()) }),
      nom: faker.lorem.words(),
      questionnaire: {},
      questionnaireUI: {},
      isValidated: false,
      deletedAt: null,
      createdBy: faker.database.mongodbObjectId(),
    },
    custom
  );
};

module.exports = {
  newCampagne,
  newTemoignage,
  newUser,
  newFormation,
  newEtablissement,
  newQuestionnaire,
};
