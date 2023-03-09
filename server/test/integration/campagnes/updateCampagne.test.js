const assert = require("assert");
const httpTests = require("../utils/httpTests");
const { newCampagne } = require("../../fixtures");

httpTests(__filename, ({ startServer }) => {
  it("should returns 200 and update the campagne", async () => {
    const { httpClient } = await startServer();
    const campagne = newCampagne();
    const newCampagneName = "updatedCampagne";
    const existingCampagne = await httpClient.post("/api/campagnes/").send(campagne);

    const campagneWithNewName = newCampagne({ ...campagne, nomCampagne: newCampagneName });

    const updatedCampagne = await httpClient
      .put(`/api/campagnes/${existingCampagne.body._id}`)
      .send(campagneWithNewName);

    assert.strictEqual(updatedCampagne.status, 200);
    assert.deepStrictEqual(updatedCampagne.body, {
      acknowledged: true,
      matchedCount: 1,
      modifiedCount: 1,
      upsertedCount: 0,
      upsertedId: null,
    });
  });
  it("should return 400 and a validation error if the payload is not correct", async () => {
    const { httpClient } = await startServer();
    const newCampagneName = "";
    const campagne = newCampagne();
    const existingCampagne = await httpClient.post("/api/campagnes/").send(campagne);

    const campagneWithNewName = { nomCampagne: newCampagneName };

    const updatedCampagne = await httpClient
      .put(`/api/campagnes/${existingCampagne.body._id}`)
      .send(campagneWithNewName);

    assert.strictEqual(updatedCampagne.status, 400);
    assert.deepStrictEqual(updatedCampagne.body, {
      details: [
        {
          context: {
            key: "nomCampagne",
            label: "nomCampagne",
            value: "",
          },
          message: '"nomCampagne" is not allowed to be empty',
          path: ["nomCampagne"],
          type: "string.empty",
        },
      ],
      error: "Bad Request",
      message: "Erreur de validation",
      statusCode: 400,
    });
  });
});
