const assert = require("assert");
const httpTests = require("../utils/httpTests");
const { newApprenti } = require("../utils/fixtures");

httpTests(__filename, ({ startServer }) => {
  it("Vérifie qu'un apprenti peut se désinscrire", async () => {
    let { httpClient, components } = await startServer();
    let { db } = components;
    let email = "apprenti@domaine.fr";
    await db.collection("apprentis").insertOne(
      newApprenti({
        email,
        unsubscribe: false,
      })
    );

    let response = await httpClient.get(`/api/unsubscribe/${email}`);

    assert.strictEqual(response.status, 200);
    assert.deepStrictEqual(response.data, { message: "Votre demande à bien été prise en compte" });
    let found = await db.collection("apprentis").findOne({ email });
    assert.strictEqual(found.unsubscribe, true);
  });

  it("Vérifie qu'une entreprise peut se désinscrire", async () => {
    let { httpClient, components } = await startServer();
    let { db } = components;
    let email = "entreprise@domaine.fr";
    await db.collection("apprentis").insertOne(
      newApprenti({
        contrats: [
          {
            entreprise: {
              email,
            },
          },
        ],
      })
    );

    let response = await httpClient.get(`/api/unsubscribe/${email}`);

    assert.strictEqual(response.status, 200);
    assert.deepStrictEqual(response.data, { message: "Votre demande à bien été prise en compte" });
    let found = await db.collection("apprentis").findOne({ "contrats.entreprise.email": email });
    assert.strictEqual(found.contrats[0].entreprise.unsubscribe, true);
  });

  it("Vérifie qu'une entreprise peut se désinscrire pour tous les contrats", async () => {
    let { httpClient, components } = await startServer();
    let { db } = components;
    let email = "entreprise@domaine.fr";
    await db.collection("apprentis").insertOne(
      newApprenti({
        contrats: [
          {
            entreprise: {
              email,
            },
          },
        ],
      })
    );
    await db.collection("apprentis").insertOne(
      newApprenti({
        contrats: [
          {
            entreprise: {
              email,
            },
          },
        ],
      })
    );

    let response = await httpClient.get(`/api/unsubscribe/${email}`);

    assert.strictEqual(response.status, 200);
    assert.deepStrictEqual(response.data, { message: "Votre demande à bien été prise en compte" });
    let res = await db.collection("apprentis").find({ "contrats.entreprise.email": email }).toArray();
    assert.strictEqual(res[0].contrats[0].entreprise.unsubscribe, true);
    assert.strictEqual(res[1].contrats[0].entreprise.unsubscribe, true);
  });
});
