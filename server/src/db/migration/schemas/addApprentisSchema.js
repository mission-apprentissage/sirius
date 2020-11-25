module.exports = async (db) => {
  return db.command({
    collMod: "apprentis",
    validationLevel: "moderate",
    validationAction: "warn",
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["nom", "prenom", "email"],
        additionalProperties: false,
        properties: {
          _id: {
            bsonType: ["string", "objectId"],
          },
          creationDate: {
            bsonType: "date",
          },
          cohorte: {
            bsonType: "string",
          },
          unsubscribe: {
            bsonType: "bool",
          },
          prenom: {
            bsonType: "string",
          },
          nom: {
            bsonType: "string",
          },
          email: {
            bsonType: "string",
          },
          telephones: {
            bsonType: "object",
            additionalProperties: false,
            properties: {
              fixe: {
                bsonType: ["string", "null"],
              },
              portable: {
                bsonType: ["string", "null"],
              },
            },
          },
          contrats: {
            bsonType: "array",
            items: {
              bsonType: "object",
              additionalProperties: false,
              properties: {
                rupture: {
                  bsonType: ["date", "null"],
                },
                formation: {
                  bsonType: "object",
                  additionalProperties: false,
                  properties: {
                    intitule: {
                      bsonType: "string",
                    },
                    periode: {
                      bsonType: "object",
                      additionalProperties: false,
                      required: ["debut", "fin"],
                      properties: {
                        debut: {
                          bsonType: "date",
                        },
                        fin: {
                          bsonType: "date",
                        },
                      },
                    },
                    anneePromotion: {
                      bsonType: ["string", "null"],
                    },
                    codeDiplome: {
                      bsonType: "string",
                      pattern: "^[0-9A-Z]{8}$",
                    },
                  },
                },
                cfa: {
                  bsonType: "object",
                  additionalProperties: false,
                  properties: {
                    adresse: {
                      bsonType: "string",
                    },
                    nom: {
                      bsonType: "string",
                    },
                    siret: {
                      bsonType: "string",
                      pattern: "^[0-9]{9,14}$",
                    },
                    uaiFormateur: {
                      bsonType: "string",
                      pattern: "^[0-9]{7}[A-Z]$",
                    },
                    uaiResponsable: {
                      bsonType: "string",
                      pattern: "^[0-9]{7}[A-Z]$",
                    },
                    codePostal: {
                      bsonType: "string",
                    },
                  },
                },
                entreprise: {
                  bsonType: "object",
                  additionalProperties: false,
                  required: ["siret"],
                  properties: {
                    raisonSociale: {
                      bsonType: ["string", "null"],
                    },
                    siret: {
                      bsonType: "string",
                      pattern: "^[0-9]{9,14}$",
                    },
                    tuteur: {
                      bsonType: "object",
                      additionalProperties: false,
                      properties: {
                        prenom: {
                          bsonType: "string",
                        },
                        nom: {
                          bsonType: "string",
                        },
                      },
                    },
                  },
                },
                questionnaires: {
                  bsonType: "array",
                  items: {
                    bsonType: "object",
                    additionalProperties: false,
                    required: ["type", "token", "status"],
                    properties: {
                      type: {
                        bsonType: "string",
                      },
                      token: {
                        bsonType: "string",
                      },
                      status: {
                        bsonType: "string",
                      },
                      updateDate: {
                        bsonType: "date",
                      },
                      sendDates: {
                        bsonType: "array",
                        items: {
                          bsonType: "date",
                        },
                      },
                      timeout: {
                        bsonType: "bool",
                      },
                      questions: {
                        bsonType: "array",
                        items: {
                          bsonType: "object",
                          additionalProperties: false,
                          required: ["id"],
                          properties: {
                            id: {
                              bsonType: "string",
                            },
                            thematique: {
                              bsonType: "string",
                            },
                            reponses: {
                              bsonType: "array",
                              items: {
                                bsonType: "object",
                                additionalProperties: false,
                                required: ["id", "label"],
                                properties: {
                                  id: {
                                    bsonType: "int",
                                  },
                                  label: {
                                    bsonType: "string",
                                  },
                                  satisfaction: {
                                    bsonType: "string",
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
};
