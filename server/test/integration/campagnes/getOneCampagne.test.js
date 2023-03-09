const assert = require("assert");
const httpTests = require("../utils/httpTests");
const { newCampagne } = require("../../fixtures");

httpTests(__filename, ({ startServer }) => {
  it("should return 200 with one campagne if it exists", async () => {
    const { httpClient, components } = await startServer();
    const campagne = newCampagne();
    const createdCampagne = await components.campagnes.create(campagne);

    const response = await httpClient.get("/api/campagnes/" + createdCampagne._id);

    assert.strictEqual(response.status, 200);
    assert.deepStrictEqual(response.body, {
      ...campagne,
      _id: response.body._id,
      __v: 0,
    });
  });
  it("should return 404 if campagne does not exist", async () => {
    const { httpClient } = await startServer();

    const response = await httpClient.get("/api/campagnes/5f7b5c5d0f7e0e2b9c7a7f1c");

    assert.strictEqual(response.status, 404);
    assert.deepStrictEqual(response.body, {
      error: "Not Found",
      message: "Campagne inconnue",
      statusCode: 404,
    });
  });
});
