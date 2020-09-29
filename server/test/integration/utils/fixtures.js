// eslint-disable-next-line node/no-unpublished-require
const faker = require("faker");
const moment = require("moment");
const _ = require("lodash");
const ObjectID = require("mongodb").ObjectID;

faker.locale = "fr";

module.exports = {
  newContrat: (custom = {}) => {
    let codeDiplome = faker.helpers.replaceSymbols("########");
    let siretCFA = faker.helpers.replaceSymbols("#########00015");
    let siretEntreprise = faker.helpers.replaceSymbols("#########00015");

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
        contrats: [
          {
            questionnaires: [],
            formation: {
              codeDiplome: codeDiplome,
              intitule: "CAP Boucher",
              anneePromotion: `${new Date().getFullYear() - 1}/${new Date().getFullYear()}`,
              periode: {
                debut: moment().subtract(1, "years").toDate(),
                fin: moment().toDate(),
              },
            },
            cfa: {
              nom: faker.company.companyName(),
              siret: siretCFA,
              uaiResponsable: faker.helpers.replaceSymbols("#######?"),
              uaiFormateur: faker.helpers.replaceSymbols("#######?"),
              adresse: `${faker.address.streetAddress()} ${faker.address.zipCode()} ${faker.address.city()}`,
            },
            rupture: null,
            entreprise: {
              raisonSociale: faker.company.companyName(),
              siret: siretEntreprise,
              tuteur: {
                prenom: faker.name.firstName(),
                nom: faker.name.lastName(),
              },
            },
          },
        ],
      },
      custom
    );
  },
};
