// eslint-disable-next-line node/no-unpublished-require
const faker = require("faker");
const moment = require("moment");
const _ = require("lodash");
const ObjectID = require("mongodb").ObjectID;

faker.locale = "fr";

module.exports = {
  newContrat: (custom = {}) => {
    return _.merge(
      {
        _id: new ObjectID(),
        creationDate: new Date(),
        cohorte: `test_q2_${moment().format("YYYY_MM_DD")}`,
        apprenti: {
          prenom: faker.name.firstName(),
          nom: faker.name.lastName(),
          email: faker.internet.email(),
          telephones: {
            fixe: faker.phone.phoneNumber("01########"),
            portable: faker.phone.phoneNumber("06########"),
          },
        },
        formation: {
          code_diplome: faker.helpers.replaceSymbols("########"),
          intitule: "CAP Boucher",
          annee_promotion: `${new Date().getFullYear() - 1}/${new Date().getFullYear()}`,
          periode: {
            debut: moment().subtract(1, "years").toDate(),
            fin: moment().toDate(),
          },
        },
        cfa: {
          uai_responsable: faker.helpers.replaceSymbols("#######?"),
          uai_formateur: faker.helpers.replaceSymbols("#######?"),
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
        questionnaires: [],
        unsubscribe: false,
      },
      custom
    );
  },
};
