const assert = require("assert");
const httpTests = require("../utils/httpTests");
const { newContrat } = require("../utils/fixtures");
const ObjectID = require("mongodb").ObjectID;

httpTests(__filename, ({ startServer }) => {
  it("Vérifie qu'un apprenti peut se désinscrire", async () => {
    let { httpClient, components } = await startServer();
    let { db } = components;
    let id = new ObjectID();
    await db.collection("contrats").insertOne(
      newContrat({
        _id: id,
        unsubscribe: false,
      })
    );

    let response = await httpClient.get(`/api/apprentis/${id}/unsubscribe`);

    assert.strictEqual(response.status, 200);
    assert.deepStrictEqual(response.data, { message: "Votre demande à bien été prise en compte" });
    let found = await db.collection("contrats").findOne({ _id: id });
    assert.strictEqual(found.unsubscribe, true);
  });
});
