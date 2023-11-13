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
        ...custom.data,
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
      questionnaire: questionnaire,
      questionnaireUI: questionnaireUI,
      isValidated: false,
      deletedAt: null,
      createdBy: faker.database.mongodbObjectId(),
    },
    custom
  );
};

const questionnaireUI = {
  pourquoiApprentissage: {
    avantFormation: {
      "ui:widget": "checkboxes",
    },
    avantFormationAutre: {
      "ui:widget": "textarea",
    },
    peurChangementConseil: {
      "ui:widget": "customMessageReceived",
    },
    "ui:order": ["avantFormation", "avantFormationAutre", "peurChangementConseil"],
  },
  trouverMonEntreprise: {
    passeEntreprise: {
      "ui:widget": "customEmojiRadioWidget",
      emojisMapping: [
        {
          value: "Mal",
          emoji: "😫",
        },
        {
          value: "Moyen",
          emoji: "🤔",
        },
        {
          value: "Bien",
          emoji: "😝",
        },
      ],
    },
    cfaAideTrouverEntreprise: {
      "ui:field": "nestedRadios",
    },
    cfaAideTrouverEntrepriseAutre: {
      "ui:field": "nestedRadios",
    },
    "ui:order": ["passeEntreprise", "cfaAideTrouverEntreprise", "cfaAideTrouverEntrepriseAutre"],
  },
  experienceTravail: {
    commentVisTonExperienceEntreprise: {
      "ui:widget": "customMultiEmojiRadioWidget",
      emojisMapping: [
        {
          value: "Pas ok",
          emoji: "😫",
        },
        {
          value: "Moyen",
          emoji: "🤔",
        },
        {
          value: "Bien",
          emoji: "😝",
        },
      ],
    },
    "ui:order": ["commentVisTonExperienceEntreprise"],
  },
  experienceCfa: {
    sensTuAccompagneAuCfa: {
      "ui:widget": "radio",
    },
    "ui:order": ["sensTuAccompagneAuCfa"],
  },
  metierFormation: {
    contentApprentissage: {
      "ui:widget": "customEmojiRadioWidget",
      emojisMapping: [
        {
          value: "Mal",
          emoji: "😫",
        },
        {
          value: "Moyen",
          emoji: "🤔",
        },
        {
          value: "Bien",
          emoji: "😝",
        },
      ],
    },
    descriptionMetierConseil: {
      "ui:widget": "customMessageReceived",
    },
    "ui:order": ["contentApprentissage", "descriptionMetierConseil"],
  },
};

const questionnaire = {
  type: "object",
  title: "Dans les premiers mois",
  properties: {
    pourquoiApprentissage: {
      title: "Pourquoi l'apprentissage ?",
      type: "object",
      description: "Pourquoi l'apprentissage ?",
      emoji: "💬",
      properties: {
        avantFormation: {
          title:
            "Merci de participer à cette récolte de témoignages ! <strong>Raconte nous, que faisais-tu juste avant de rejoindre cette formation ?</strong>",
          type: "array",
          uniqueItems: true,
          minItems: 1,
          items: {
            type: "string",
            enum: [
              "Collège",
              "Lycée (général ou technologique ou professionnel)",
              "Autre formation en apprentissage",
              "Pas scolarisé",
              "Petit boulot, job, stage...",
              "Reconversion professionnelle",
              "Autre chose",
            ],
          },
        },
        peurChangementConseil: {
          legend: "<strong>Nadia</strong>, 3e au collège Jean-Moulin <strong>se pose une question...</strong>",
          title:
            "<strong>Salut, j’appréhende de commencer une formation en apprentissage !</strong><br /><br /> Qu’est ce qui change par rapport à ton école d’avant (collège, lycée etc) ? 🤗😬",
          picto: "nadia",
          type: "string",
        },
      },
      dependencies: {
        avantFormation: {
          oneOf: [
            {
              properties: {
                avantFormation: {
                  items: {
                    enum: [
                      "Collège",
                      "Lycée (général ou technologique ou professionnel)",
                      "Autre formation en apprentissage",
                      "Pas scolarisé",
                      "Petit boulot, job, stage...",
                      "Reconversion professionnelle",
                    ],
                  },
                },
              },
            },
            {
              properties: {
                avantFormation: {
                  contains: {
                    enum: ["Autre chose"],
                  },
                },
                avantFormationAutre: {
                  title: "Préciser",
                  type: "string",
                },
              },
            },
          ],
        },
      },
      required: [],
    },
    trouverMonEntreprise: {
      title: "Trouver mon entreprise",
      type: "object",
      description: "Trouver mon entreprise",
      emoji: "🤝",
      properties: {
        passeEntreprise: {
          type: "string",
          subType: "emoji",
          title:
            "On sait que trouver une entreprise n'est pas toujours facile. <strong>Comment ça s'est passé pour toi ?</strong>",
        },
        cfaAideTrouverEntreprise: {
          title: "<strong>As-tu eu besoin que le CFA t’accompagne dans ta recherche d’entreprise ?</strong>",
          info: "C’est le rôle du CFA de t’aider à trouver une entreprise si tu en as besoin",
          type: "string",
          enum: [
            "Oui j’ai eu besoin de lui et il m’a aidé",
            "Oui j’ai eu besoin mais il ne m’a pas aidé",
            "Non je n’ai pas eu besoin de lui, j’ai trouvé mon entreprise autrement",
          ],
        },
      },
      dependencies: {
        cfaAideTrouverEntreprise: {
          oneOf: [
            {
              properties: {
                cfaAideTrouverEntreprise: {
                  contains: {
                    enum: ["Oui j’ai eu besoin de lui et il m’a aidé"],
                  },
                },
                cfaAideTrouverEntrepriseAutre: {
                  type: "checkboxes",
                  enum: [
                    "Il m’a aidé à faire mon CV et/ou ma lettre de motivation",
                    "Il m’a aidé à préparer mes entretiens",
                    "Il a proposé ma candidature à des entreprises",
                    "Il m’a aidé autrement",
                  ],
                },
              },
            },
            {
              properties: {
                cfaAideTrouverEntreprise: {
                  contains: {
                    enum: ["Il m’a aidé autrement"],
                  },
                },
                cfaAideTrouverEntrepriseAutre: {
                  type: "textarea",
                },
              },
            },
          ],
        },
      },
      required: ["passeEntreprise", "cfaAideTrouverEntreprise"],
    },
    experienceTravail: {
      title: "Mon expérience au travail",
      type: "object",
      description: "Mon expérience au travail",
      emoji: "👷🏻",
      properties: {
        commentVisTonExperienceEntreprise: {
          title: "Rentrons dans le vif du sujet, <strong>comment vis-tu ton expérience en entreprise ?</strong>",
          type: "array",
          subType: "multiEmoji",
          uniqueItems: true,
          minItems: 5,
          items: {
            type: "object",
            properties: {
              label: {
                type: "string",
              },
              value: {
                type: "string",
              },
            },
          },
          questions: [
            "<strong>Le rythme</strong> entreprise <-> école",
            "<strong>Les horaires</strong> en entreprise",
            "D’avoir moins de <strong>vacances</strong>",
            "<strong>Ce que tu apprends de ce métier</strong> dans ton entreprise",
            "<strong>Ton intégration et l’ambiance</strong> dans ton entreprise",
          ],
        },
      },
      dependencies: {},
      required: ["commentVisTonExperienceEntreprise"],
    },
    experienceCfa: {
      title: "Mon expérience au CFA",
      type: "object",
      description: "Mon expérience au CFA",
      emoji: "👨🏽‍🎓",
      properties: {
        sensTuAccompagneAuCfa: {
          title: "Au quotidien, te sens-tu soutenu·e par les équipes du CFA ?",
          info: "C’est le rôle du CFA de t’accompagner dans ton intégration et tes premiers pas dans le monde professionnel",
          type: "string",
          enum: [
            "Oui les formateurs et l'équipe encadrante sont très disponibles",
            "Oui, ils sont disponibles tout en nous laissant beaucoup en autonomie",
            "Moyen, on communique peu avec les équipes et les formateurs",
            "Non l'équipe n'est pas à l'écoute de nos besoins",
          ],
        },
      },
      dependencies: {},
      required: ["sensTuAccompagneAuCfa"],
    },
    metierFormation: {
      title: "Le métier, la formation",
      type: "object",
      description: "Le métier, la formation",
      emoji: "💛",
      properties: {
        contentApprentissage: {
          type: "string",
          subType: "emoji",
          title: "Alors ? Bilan ! <strong>Es-tu content·e d’apprendre ce métier ?</strong>",
        },
      },
      dependencies: {},
      required: ["contentApprentissage"],
    },
  },
  dependencies: {},
  required: [],
};

module.exports = {
  newCampagne,
  newTemoignage,
  newUser,
  newFormation,
  newEtablissement,
  newQuestionnaire,
};
