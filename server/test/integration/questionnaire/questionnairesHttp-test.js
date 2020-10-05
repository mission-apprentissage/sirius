const moment = require("moment");
const assert = require("assert");
const httpTests = require("../utils/httpTests");
const { newApprenti, newContrat, newQuestionnaire } = require("../utils/fixtures");

httpTests(__filename, ({ startServer }) => {
  it("Vérifie qu'on peut prévisualiser l'email", async () => {
    let { httpClient, components } = await startServer();
    let { db } = components;
    await db.collection("apprentis").insertOne(
      newApprenti({
        contrats: [
          newContrat({
            questionnaires: [
              newQuestionnaire({
                type: "finAnnee",
                token: "123456",
                questions: [{ id: "début", data: { value: 1, label: "ok" } }],
              }),
            ],
          }),
        ],
      })
    );

    let response = await httpClient.get("/api/questionnaires/123456/previewEmail");

    assert.strictEqual(response.status, 200);
    let html = response.data;
    assert.ok(html.indexOf("Bonjour") !== -1);
  });

  it("Vérifie qu'on peut marquer un email comme ayant été ouvert", async () => {
    let { httpClient, components } = await startServer();
    let { db } = components;
    await db.collection("apprentis").insertOne(
      newApprenti({
        contrats: [
          newContrat({
            questionnaires: [
              newQuestionnaire({
                type: "finAnnee",
                token: "123456",
                questions: [{ id: "début", data: { value: 1, label: "ok" } }],
              }),
            ],
          }),
        ],
      })
    );

    let response = await httpClient.get("/api/questionnaires/123456/markAsOpened");

    assert.strictEqual(response.status, 200);
    let found = await db.collection("apprentis").findOne({ "contrats.questionnaires.token": "123456" });
    let finAnnee = found.contrats[0].questionnaires[0];
    assert.deepStrictEqual(finAnnee.status, "opened");
  });

  it("Vérifie qu'on peut démarrer un questionnaire", async () => {
    let { httpClient, components } = await startServer();
    let { db } = components;
    await db.collection("apprentis").insertOne(
      newApprenti({
        prenom: "Robert",
        nom: "Doe",
        contrats: [
          newContrat({
            formation: {
              intitule: "CAP Boucher à Institut régional de formation des métiers de l'artisanat",
            },
            questionnaires: [
              newQuestionnaire({
                type: "finAnnee",
                token: "123456",
                status: "sent",
                questions: [],
              }),
            ],
          }),
        ],
      })
    );

    let response = await httpClient.put("/api/questionnaires/123456/markAsClicked");

    assert.strictEqual(response.status, 200);
    assert.deepStrictEqual(response.data, {
      type: "finAnnee",
      apprenti: {
        prenom: "Robert",
        nom: "Doe",
      },
      formation: {
        intitule: "CAP Boucher à Institut régional de formation des métiers de l'artisanat",
      },
    });

    let found = await db.collection("apprentis").findOne({ "contrats.questionnaires.token": "123456" });
    let finAnnee = found.contrats[0].questionnaires[0];
    assert.deepStrictEqual(finAnnee.status, "clicked");
  });

  it("Vérifie qu'on peut réinitialiser un questionnaire", async () => {
    let { httpClient, components } = await startServer();
    let { db } = components;
    await db.collection("apprentis").insertOne(
      newApprenti({
        contrats: [
          newContrat({
            questionnaires: [
              newQuestionnaire({
                type: "finAnnee",
                token: "123456",
                status: "clicked",
                questions: [{ id: "début", data: { value: 1, label: "ok" } }],
              }),
            ],
          }),
        ],
      })
    );

    let response = await httpClient.put("/api/questionnaires/123456/markAsClicked");

    assert.strictEqual(response.status, 200);
    let found = await db.collection("apprentis").findOne({ "contrats.questionnaires.token": "123456" });
    let finAnnee = found.contrats[0].questionnaires[0];
    assert.deepStrictEqual(finAnnee.status, "clicked");
    assert.deepStrictEqual(finAnnee.questions, []);
  });

  it("Vérifie qu'on ne peut pas démarrer un questionnaire avec un token invalide", async () => {
    let { httpClient, components } = await startServer();
    let { db } = components;
    await db.collection("apprentis").insertOne(
      newApprenti({
        contrats: [
          newContrat({
            questionnaires: [
              newQuestionnaire({
                type: "finAnnee",
                token: "123456",
                status: "sent",
                questions: [],
              }),
            ],
          }),
        ],
      })
    );

    let response = await httpClient.put("/api/questionnaires/invalid/markAsClicked");

    assert.strictEqual(response.status, 400);
    assert.deepStrictEqual(response.data, {
      error: "Bad Request",
      message: "Questionnaire inconnu",
      statusCode: 400,
    });
  });

  it("Vérifie qu'on peut ajouter une réponse", async () => {
    let { httpClient, components } = await startServer();
    let { db } = components;
    await db.collection("apprentis").insertOne(
      newApprenti({
        contrats: [
          newContrat({
            questionnaires: [
              newQuestionnaire({
                token: "123456",
                type: "finAnnee",
                status: "sent",
                questions: [],
              }),
            ],
          }),
        ],
      })
    );

    let response = await httpClient.put("/api/questionnaires/123456/answerToQuestion/début", [{ id: 1, label: "ok" }]);

    assert.strictEqual(response.status, 200);

    let found = await db.collection("apprentis").findOne({ "contrats.questionnaires.token": "123456" });
    let finAnnee = found.contrats[0].questionnaires[0];
    assert.ok(finAnnee.updateDate);
    assert.deepStrictEqual(finAnnee.questions, [{ id: "début", reponses: [{ id: 1, label: "ok" }] }]);
  });

  it("Vérifie qu'on ne peut pas ajouter une réponse à un questionnaire closed", async () => {
    let { httpClient, components } = await startServer();
    let { db } = components;
    await db.collection("apprentis").insertOne(
      newApprenti({
        contrats: [
          newContrat({
            questionnaires: [
              newQuestionnaire({
                token: "123456",
                type: "finAnnee",
                status: "closed",
                questions: [],
              }),
            ],
          }),
        ],
      })
    );

    let response = await httpClient.put("/api/questionnaires/123456/answerToQuestion/début", [{ id: 1, label: "ko" }]);

    assert.strictEqual(response.status, 400);
    assert.deepStrictEqual(response.data, {
      error: "Bad Request",
      message: "Impossible de changer le status du questionnaire en cours car il est 'closed'",
      statusCode: 400,
    });
  });

  it("Vérifie qu'on peut modifier une réponse", async () => {
    let { httpClient, components } = await startServer();
    let { db } = components;
    await db.collection("apprentis").insertOne(
      newApprenti({
        contrats: [
          newContrat({
            questionnaires: [
              newQuestionnaire({
                type: "finAnnee",
                token: "123456",
                status: "inprogress",
                questions: [{ id: "début", reponses: [{ id: 1, label: "ok" }] }],
              }),
            ],
          }),
        ],
      })
    );

    let response = await httpClient.put("/api/questionnaires/123456/answerToQuestion/début", [
      { id: 1, label: "other" },
    ]);

    assert.strictEqual(response.status, 200);
    let found = await db.collection("apprentis").findOne({ "contrats.questionnaires.token": "123456" });
    let finAnnee = found.contrats[0].questionnaires[0];
    assert.deepStrictEqual(finAnnee.questions, [{ id: "début", reponses: [{ id: 1, label: "other" }] }]);
    assert.deepStrictEqual(finAnnee.status, "inprogress");
  });

  it("Vérifie qu'on peut terminer un questionnaire", async () => {
    let { httpClient, components } = await startServer();
    let { db } = components;
    await db.collection("apprentis").insertOne(
      newApprenti({
        contrats: [
          newContrat({
            questionnaires: [
              newQuestionnaire({
                type: "finAnnee",
                token: "123456",
                questions: [{ id: "début", data: { value: 1, label: "ok" } }],
              }),
            ],
          }),
        ],
      })
    );

    let response = await httpClient.put("/api/questionnaires/123456/close");

    assert.strictEqual(response.status, 200);

    let found = await db.collection("apprentis").findOne({ "contrats.questionnaires.token": "123456" });
    let finAnnee = found.contrats[0].questionnaires[0];
    assert.deepStrictEqual(finAnnee.status, "closed");
  });

  it("Vérifie qu'on peut obtenir les statistiques", async () => {
    let { httpClient, components } = await startServer();
    let { db } = components;
    await db.collection("apprentis").insertOne(
      newApprenti({
        contrats: [
          newContrat({
            questionnaires: [
              newQuestionnaire({
                token: "123456",
                type: "finAnnee",
                status: "closed",
                questions: [],
              }),
            ],
          }),
        ],
      })
    );

    let response = await httpClient.get("/api/questionnaires/stats.json", {
      headers: {
        Authorization: `Basic ${Buffer.from("admin:12345").toString("base64")}`,
      },
    });

    assert.strictEqual(response.status, 200);
    let first = response.data;
    assert.deepStrictEqual(first, [
      {
        _id: moment().format("YYYY-MM-DD"),
        questionnaires: [
          {
            envoyes: 1,
            ouverts: 1,
            cliques: 1,
            enCours: 0,
            termines: 1,
            erreurs: 0,
            date: moment().format("YYYY-MM-DD"),
            type: "finAnnee",
          },
        ],
      },
    ]);
  });
});
