// eslint-disable-next-line node/no-unpublished-require
const faker = require("faker");
const uuid = require("uuid");
const moment = require("moment");
const _ = require("lodash");
const ObjectID = require("mongodb").ObjectID;

faker.locale = "fr";

let newContrat = (custom = {}) => {
  return _.merge(
    {
      questionnaires: [],
      formation: {
        codeDiplome: faker.helpers.replaceSymbols("########"),
        intitule: "CAP Boucher",
        anneePromotion: `${new Date().getFullYear() - 1}/${new Date().getFullYear()}`,
        periode: {
          debut: moment().subtract(1, "years").toDate(),
          fin: moment().toDate(),
        },
      },
      cfa: {
        nom: faker.company.companyName(),
        siret: faker.helpers.replaceSymbols("#########00015"),
        uaiResponsable: faker.helpers.replaceSymbols("#######?"),
        uaiFormateur: faker.helpers.replaceSymbols("#######?"),
        adresse: `${faker.address.streetAddress()} ${faker.address.zipCode()} ${faker.address.city()}`,
      },
      rupture: null,
      entreprise: {
        raisonSociale: faker.company.companyName(),
        siret: faker.helpers.replaceSymbols("#########00015"),
        tuteur: {
          prenom: faker.name.firstName(),
          nom: faker.name.lastName(),
        },
      },
    },
    custom
  );
};

module.exports = {
  newContrat,
  newQuestionnaire: (custom = {}) => {
    return _.merge(
      {
        type: "finAnnee",
        token: uuid.v4(),
        status: "sent",
        sendDates: [new Date()],
        questions: [],
      },
      custom
    );
  },
  newApprenti: (custom = {}) => {
    return _.merge(
      {
        _id: new ObjectID(),
        creationDate: new Date(),
        cohorte: `test_q2_${moment().format("YYYY_MM_DD")}`,
        prenom: faker.name.firstName(),
        nom: faker.name.lastName(),
        email: faker.internet.email(),
        telephones: {
          fixe: faker.phone.phoneNumber("01########"),
          portable: faker.phone.phoneNumber("06########"),
        },
        unsubscribe: false,
        contrats: [newContrat()],
      },
      custom
    );
  },
};
