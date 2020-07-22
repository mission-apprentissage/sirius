const assert = require("assert");
const httpTests = require("../utils/httpTests");
const { newContrat } = require("../utils/fixtures");

httpTests(__filename, ({ startServer }) => {
  it("Vérifie qu'on peut démarrer un questionnaire", async () => {
    let { httpClient, components } = await startServer();
    let { db } = components;
    await db.collection("contrats").insertOne(
      newContrat({
        apprenti: {
          prenom: "Robert",
          nom: "Doe",
        },
        formation: {
          intitule: "CAP Boucher à Institut régional de formation des métiers de l'artisanat",
        },
        questionnaires: [
          {
            type: "finAnnee",
            token: "123456",
            status: "sent",
            reponses: [],
          },
        ],
      })
    );

    let response = await httpClient.put("/api/questionnaires/123456/open");

    assert.strictEqual(response.status, 200);
    assert.deepStrictEqual(response.data, {
      apprenti: {
        prenom: "Robert",
        nom: "Doe",
      },
      formation: {
        intitule: "CAP Boucher à Institut régional de formation des métiers de l'artisanat",
      },
    });
  });

  it("Vérifie qu'on peut réinitialiser un questionnaire", async () => {
    let { httpClient, components } = await startServer();
    let { db } = components;
    await db.collection("contrats").insertOne(
      newContrat({
        questionnaires: [
          {
            type: "finAnnee",
            token: "123456",
            status: "opened",
            reponses: [{ id: "début", data: { value: 1, label: "ok" } }],
          },
        ],
      })
    );

    let response = await httpClient.put("/api/questionnaires/123456/open");

    assert.strictEqual(response.status, 200);
    let found = await db.collection("contrats").findOne({ "questionnaires.token": "123456" });
    let finAnnee = found.questionnaires[0];
    assert.deepStrictEqual(finAnnee.reponses, []);
  });

  it("Vérifie qu'on ne peut pas démarrer un questionnaire avec un token invalide", async () => {
    let { httpClient, components } = await startServer();
    let { db } = components;
    await db.collection("contrats").insertOne(
      newContrat({
        questionnaires: [
          {
            type: "finAnnee",
            token: "123456",
            status: "sent",
            reponses: [],
          },
        ],
      })
    );

    let response = await httpClient.put("/api/questionnaires/invalid/open");

    assert.strictEqual(response.status, 400);
    assert.deepStrictEqual(response.data, {
      error: "Bad Request",
      message: "Le lien n'est pas valide",
      statusCode: 400,
    });
  });

  it("Vérifie qu'on peut ajouter une réponse", async () => {
    let { httpClient, components } = await startServer();
    let { db } = components;
    await db.collection("contrats").insertOne(
      newContrat({
        questionnaires: [
          {
            token: "123456",
            type: "finAnnee",
            status: "sent",
            reponses: [],
          },
        ],
      })
    );

    let response = await httpClient.put("/api/questionnaires/123456/addReponse", {
      id: "début",
      data: { value: 1, label: "ok" },
    });

    assert.strictEqual(response.status, 200);

    let found = await db.collection("contrats").findOne({ "questionnaires.token": "123456" });
    let finAnnee = found.questionnaires[0];
    assert.ok(finAnnee.updateDate);
    assert.deepStrictEqual(finAnnee.reponses, [{ id: "début", data: { value: 1, label: "ok" } }]);
  });

  it("Vérifie qu'on ne peut pas ajouter une réponse à un questionnaire closed", async () => {
    let { httpClient, components } = await startServer();
    let { db } = components;
    await db.collection("contrats").insertOne(
      newContrat({
        questionnaires: [
          {
            token: "123456",
            type: "finAnnee",
            status: "closed",
            reponses: [],
          },
        ],
      })
    );

    let response = await httpClient.put("/api/questionnaires/123456/addReponse", {
      id: "début",
      data: { value: 1, label: "ok" },
    });

    assert.strictEqual(response.status, 400);
    assert.deepStrictEqual(response.data, {
      error: "Bad Request",
      message: "Le questionnaire n'est plus disponible",
      statusCode: 400,
    });
  });

  it("Vérifie qu'on peut modifier une réponse", async () => {
    let { httpClient, components } = await startServer();
    let { db } = components;
    await db.collection("contrats").insertOne(
      newContrat({
        questionnaires: [
          {
            type: "finAnnee",
            token: "123456",
            status: "inprogress",
            reponses: [{ id: "début", data: { value: 1, label: "ok" } }],
          },
        ],
      })
    );

    let response = await httpClient.put("/api/questionnaires/123456/addReponse", {
      id: "début",
      data: { value: 2, label: "ko" },
    });

    assert.strictEqual(response.status, 200);
    let found = await db.collection("contrats").findOne({ "questionnaires.token": "123456" });
    let finAnnee = found.questionnaires[0];
    assert.deepStrictEqual(finAnnee.reponses, [{ id: "début", data: { value: 2, label: "ko" } }]);
    assert.deepStrictEqual(finAnnee.status, "inprogress");
  });

  it("Vérifie qu'on peut terminer un questionnaire", async () => {
    let { httpClient, components } = await startServer();
    let { db } = components;
    await db.collection("contrats").insertOne(
      newContrat({
        questionnaires: [
          {
            type: "finAnnee",
            token: "123456",
            reponses: [{ id: "début", data: { value: 1, label: "ok" } }],
          },
        ],
      })
    );

    let response = await httpClient.put("/api/questionnaires/123456/close");

    assert.strictEqual(response.status, 200);

    let found = await db.collection("contrats").findOne({ "questionnaires.token": "123456" });
    let finAnnee = found.questionnaires[0];
    assert.deepStrictEqual(finAnnee.status, "closed");
  });

  it.only("Vérifie qu'on peut prévisualiser l'email", async () => {
    let { httpClient, components } = await startServer();
    let { db } = components;
    await db.collection("contrats").insertOne(
      newContrat({
        questionnaires: [
          {
            type: "finAnnee",
            token: "123456",
            reponses: [{ id: "début", data: { value: 1, label: "ok" } }],
          },
        ],
      })
    );

    let response = await httpClient.get("/api/questionnaires/123456/email");

    assert.strictEqual(response.status, 200);
    let html = response.data;
    assert.ok(html.indexOf("Bonjour") !== -1);
  });
});
