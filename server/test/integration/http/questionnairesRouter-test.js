const assert = require("assert");
const httpTests = require("../utils/httpTests");
const { newApprenti } = require("../utils/fixtures");

httpTests(__filename, ({ startServer }) => {
  it("Vérifie qu'on peut obtenir un questionnaire", async () => {
    let { httpClient, components } = await startServer();
    let { db } = components;

    await db.collection("apprentis").insertOne(
      newApprenti({
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

    let response = await httpClient.get("/api/questionnaires/123456");

    assert.strictEqual(response.status, 200);
    assert.deepStrictEqual(response.data, {
      type: "finAnnee",
      meta: {
        apprenti: {
          prenom: "Marie",
          nom: "Louise",
          formation: {
            intitule: "CAP Boucher à Institut régional de formation des métiers de l'artisanat",
          },
        },
      },
    });
  });

  it("Vérifie qu'on peut ajouter une réponse", async () => {
    let { httpClient, components } = await startServer();
    let { db } = components;

    await db.collection("apprentis").insertOne(
      newApprenti({
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

    let response = await httpClient.put("/api/questionnaires/123456/reponse", {
      id: "début",
      data: { value: 1, label: "ok" },
    });

    assert.strictEqual(response.status, 200);
    assert.deepStrictEqual(response.data, {
      type: "finAnnee",
      meta: {
        apprenti: {
          prenom: "Marie",
          nom: "Louise",
          formation: {
            intitule: "CAP Boucher à Institut régional de formation des métiers de l'artisanat",
          },
        },
      },
    });

    let found = await db.collection("apprentis").findOne({ "questionnaires.token": "123456" });
    let finAnnee = found.questionnaires[0];
    assert.ok(finAnnee.updateDate);
    assert.deepStrictEqual(finAnnee.reponses, [{ id: "début", data: { value: 1, label: "ok" } }]);
  });

  it("Vérifie qu'on peut modifier une réponse", async () => {
    let { httpClient, components } = await startServer();
    let { db } = components;

    await db.collection("apprentis").insertOne(
      newApprenti({
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

    let response = await httpClient.put("/api/questionnaires/123456/reponse", {
      id: "début",
      data: { value: 2, label: "ko" },
    });

    assert.strictEqual(response.status, 200);

    let found = await db.collection("apprentis").findOne({ "questionnaires.token": "123456" });
    let finAnnee = found.questionnaires[0];
    assert.deepStrictEqual(finAnnee.reponses, [{ id: "début", data: { value: 2, label: "ko" } }]);
    assert.deepStrictEqual(finAnnee.status, "inprogress");
  });

  it("Vérifie qu'on peut terminer un questionnaire", async () => {
    let { httpClient, components } = await startServer();
    let { db } = components;

    await db.collection("apprentis").insertOne(
      newApprenti({
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

    let found = await db.collection("apprentis").findOne({ "questionnaires.token": "123456" });
    let finAnnee = found.questionnaires[0];
    assert.deepStrictEqual(finAnnee.status, "closed");
  });
});
