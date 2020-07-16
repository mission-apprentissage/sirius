const assert = require("assert");
const httpTests = require("../utils/httpTests");
const { newApprenti } = require("../utils/fixtures");

httpTests(__filename, ({ startServer }) => {
  it("Vérifie qu'on peut obtenir un email ", async () => {
    let { httpClient, components } = await startServer();
    let { db } = components;
    await db.collection("apprentis").insertOne(newApprenti({ token: "123456" }));

    let response = await httpClient.get("/api/questionnaires/123456");

    assert.strictEqual(response.status, 200);
    assert.deepStrictEqual(response.data, {
      prenom: "Marie",
      nom: "Louise",
      formation: {
        intitule: "CAP Boucher à Institut régional de formation des métiers de l'artisanat - IRFMA de l'Aude",
      },
    });
  });
});
